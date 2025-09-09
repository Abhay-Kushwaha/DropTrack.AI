from typing import Dict, Any, List, Tuple
from bson import ObjectId
from collections import defaultdict
import re

import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

try:
    from imblearn.over_sampling import SMOTE
    _HAS_IMB = True
except Exception:
    _HAS_IMB = False

try:
    import lightgbm as lgb
    _HAS_LGB = True
except Exception:
    _HAS_LGB = False

RANDOM_STATE = 42

def _avg_test_score_from_marks(marks_map: Dict[str, List[float]]) -> float:
    """
    'marks' is a Map[str -> List[number]] per your Marks schema.
    We take the last score per subject if present; otherwise overall mean.
    """
    finals = []
    for subj, arr in (marks_map or {}).items():
        if isinstance(arr, list) and len(arr) > 0:
            finals.append(arr[-1])
    if finals:
        return float(np.mean(finals))

    allv = []
    for arr in (marks_map or {}).values():
        if isinstance(arr, list):
            allv.extend([v for v in arr if isinstance(v, (int, float))])
    return float(np.mean(allv)) if allv else np.nan

def resolve_school_oid(db, *, school_public_id=None, school_name=None) -> ObjectId:
    """
    Resolve school's Mongo _id WITHOUT accepting it from the client directly.
    Priority:
      1) numeric SchoolID (public field)
      2) Name (case-insensitive exact match)
    """
    query = None
    if school_public_id is not None:
        try:
            query = {"SchoolID": int(school_public_id)}  # schools.SchoolID is Number
        except Exception:
            pass
    if not query and school_name:
        query = {"Name": {"$regex": f"^{re.escape(school_name)}$", "$options": "i"}}
    if not query:
        raise ValueError("Provide school_public_id (number) or school_name.")

    doc = db["schools"].find_one(query, {"_id": 1})
    if not doc:
        raise ValueError("School not found for the provided identifier.")
    return doc["_id"]

def build_school_dataframe(db, school_oid: ObjectId, fees_months_denom: int = 12) -> pd.DataFrame:
    """
    Build the frame the notebook expects:
      StudentID | Attendance_Rate | Test_Score | Fees | Reason
    Collections used:
      - students: AttendancePercentage, Reasons, SchoolID[]
      - marks   : Students[].Student1, Students[].marks
      - fees    : school_Id, Students[].student_id, Students[].No_unpaid_Month
    """
    sid = school_oid

    # --- students (Attendance_Rate, Reason) ---
    # Student schema keeps SchoolID as an ARRAY of ObjectIds -> use $in
    cur = db["students"].find(
        {"SchoolID": {"$in": [sid]}},  # students.SchoolID is array  :contentReference[oaicite:2]{index=2}
        {
            "_id": 1,
            "AttendancePercentage": 1,
            "Reasons": 1,
        },
    )
    students = list(cur)
    if not students:
        return pd.DataFrame(columns=["StudentID","Attendance_Rate","Test_Score","Fees","Reason"])

    base = {
        s["_id"]: {
            "StudentID": str(s["_id"]),
            "Attendance_Rate": float(s.get("AttendancePercentage", 0.0) or 0.0),
            "Reason": s.get("Reasons") or "",
        } for s in students
    }

    # --- marks (compute Test_Score from last scores per subject) ---
    marks_docs = db["marks"].find({"SchoolId": sid}, {"Students": 1})
    marks_map = defaultdict(list)  # student_id -> list of per-doc averages
    for doc in marks_docs:
        for row in doc.get("Students", []):
            st_id = row.get("Student1")
            if st_id in base:
                m = row.get("marks") or {}
                avg = _avg_test_score_from_marks(m)
                if np.isfinite(avg):
                    marks_map[st_id].append(avg)

    for oid in base.keys():
        base[oid]["Test_Score"] = float(np.mean(marks_map[oid])) if marks_map.get(oid) else 0.0

    # --- fees (fraction of unpaid months) ---
    fees_by_student = {}
    for fdoc in db["fees"].find({"school_Id": sid}, {"Students": 1}):
        if not isinstance(fdoc.get("Students"), list):
            continue
        for s in fdoc["Students"]:
            st = s.get("student_id")
            months = s.get("No_unpaid_Month", 0)
            try:
                frac = float(months) / float(fees_months_denom or 12)
            except Exception:
                frac = 0.0
            fees_by_student[st] = max(fees_by_student.get(st, 0.0), max(0.0, min(1.0, frac)))

    for oid in base.keys():
        base[oid]["Fees"] = float(fees_by_student.get(oid, 0.0))

    df = pd.DataFrame(base.values())
    df["Test_Score"] = df["Test_Score"].fillna(0.0)
    df["Attendance_Rate"] = df["Attendance_Rate"].fillna(0.0)
    df["Fees"] = df["Fees"].fillna(0.0)
    df["Reason"] = df["Reason"].fillna("")
    return df

def _calculate_risk_for_row(row: pd.Series) -> Tuple[float, str, str, str]:
    """
    Rule-based score mirroring the notebook thresholds:
      - Attendance: <50 => +35, <75 => +25, else +0
      - Test_Score: <40 => +35, <60 => +20, else +0
      - Fees (0..1): <=0.3 => +5, 0.4..0.7 => +15, >0.7 => +30
    """
    score = 0
    reasons = []

    if row["Attendance_Rate"] < 50:
        score += 35; reasons.append("Low attendance")
    elif row["Attendance_Rate"] < 75:
        score += 25; reasons.append("Moderate attendance")
    else:
        reasons.append("Good attendance")

    if row["Test_Score"] < 40:
        score += 35; reasons.append("Low test performance")
    elif row["Test_Score"] < 60:
        score += 20; reasons.append("Moderate test performance")
    else:
        reasons.append("Good test performance")

    f = row["Fees"]
    if f <= 0.3:
        score += 5; reasons.append("Low risk fees")
    elif 0.4 <= f <= 0.7:
        score += 15; reasons.append("Moderate risk fees")
    else:
        score += 30; reasons.append("High risk fees")

    score = min(score, 100)

    if score >= 60:
        level, color = "High", "Red"
    elif score >= 30:
        level, color = "Medium", "Orange"
    else:
        level, color = "Low", "Green"

    # Merge with explicit student Reason (if any)
    if isinstance(row.get("Reason"), str) and row["Reason"].strip():
        reason_text = row["Reason"] + ", " + ", ".join(reasons)
    else:
        reason_text = ", ".join(reasons)

    return score, level, color, reason_text
    



def run_prediction_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """
    Steps:
      1) Rule-based scoring -> Risk_Score/Level/Color/Reason
      2) Quantile pseudo-labels (0/1/2)
      3) Scale -> (optional) SMOTE (only if class counts support it)
      4) Classifier -> predict proba
      5) If tiny/degenerate class case, fall back to rule-based probability
    """
    if df.empty:
        return df

    # 1) Rule-based scoring
    rb = df.apply(_calculate_risk_for_row, axis=1, result_type="expand")
    rb.columns = ["Risk_Score", "Risk_Level", "Risk_Color", "Dropout_Reason"]
    df = pd.concat([df, rb], axis=1)

    # 2) Quantile pseudo-labels -> At_Risk
    # With tiny N, q1 and q2 can coincide; that's OK, we'll handle degenerate classes below.
    q1, q2 = df["Risk_Score"].quantile([0.33, 0.66])
    def _risk_class(s):
        if s <= q1: return 0
        if s <= q2: return 1
        return 2
    df["At_Risk"] = df["Risk_Score"].apply(_risk_class)

    # If we don't have at least 2 classes, fall back to rule-based only.
    y = df["At_Risk"].to_numpy()
    unique_classes, counts = np.unique(y, return_counts=True)
    if len(unique_classes) < 2:
        # Pure rule-based fallback
        df["Dropout_Probability"] = (df["Risk_Score"] / 100.0).clip(0.0, 1.0)
        df["Predicted_Risk_Level"] = df["Risk_Level"]
        return df

    # 3) Features & scaling
    features = ["Attendance_Rate", "Test_Score", "Fees"]
    X = df[features].to_numpy(dtype=float)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Optional SMOTE — only if every minority class has >= (k_neighbors + 1) samples
    X_bal, y_bal = X_scaled, y
    if _HAS_IMB:
        min_class_count = counts.min()
        # Choose the largest valid k_neighbors (>=1) but never more than 5
        k = min(5, int(min_class_count) - 1)
        if k >= 1:
            sm = SMOTE(random_state=RANDOM_STATE, k_neighbors=k)
            X_bal, y_bal = sm.fit_resample(X_scaled, y)
        # else: too few samples in the smallest class — skip SMOTE

    # 4) Train classifier (LBGM for huge sets else RF)
    if _HAS_LGB and len(df) > 50000:
        model = lgb.LGBMClassifier(
            n_estimators=200, max_depth=15, learning_rate=0.1, random_state=RANDOM_STATE
        )
    else:
        model = RandomForestClassifier(
            n_estimators=200, random_state=RANDOM_STATE, class_weight="balanced", n_jobs=-1
        )

    # Guard: very tiny sets (e.g., total N < 3) can still break some learners
    try:
        model.fit(X_bal, y_bal)
        proba = model.predict_proba(X_scaled)  # shape [n,3]
        df["Dropout_Probability"] = proba.max(axis=1)
        idx_to_label = {0: "Low", 1: "Medium", 2: "High"}
        df["Predicted_Risk_Level"] = [idx_to_label[int(np.argmax(p))] for p in proba]
    except Exception:
        # Final safety: use rule-based fallback
        df["Dropout_Probability"] = (df["Risk_Score"] / 100.0).clip(0.0, 1.0)
        df["Predicted_Risk_Level"] = df["Risk_Level"]

    return df




def to_api_payload(df: pd.DataFrame) -> Dict[str, Any]:

    """Trim and JSON-ify."""
    if df.empty:
        return {"count": 0, "results": []}

    out_cols = [
        "StudentID","Risk_Score","Risk_Level","Risk_Color","Dropout_Reason",
        "Dropout_Probability","Predicted_Risk_Level"
    ]
    payload = df[out_cols].copy()
    records = []
    for r in payload.to_dict(orient="records"):
        r["Risk_Score"] = float(r["Risk_Score"])
        r["Dropout_Probability"] = float(r["Dropout_Probability"])
        records.append(r)
    return {"count": len(records), "results": records}
