# ML_Apps/prediction_region_pipeline.py
from typing import Dict, Any
from bson import ObjectId
import re
import numpy as np
import pandas as pd
from collections import defaultdict

from .prediction_pipeline import (
    _avg_test_score_from_marks,
    run_prediction_pipeline,
    to_api_payload,
)

# ----------- Resolver helpers (never accept ObjectId from client) -----------
def resolve_district_oid(db, district_name: str) -> ObjectId:
    q = {"district": {"$regex": f"^{re.escape(district_name.strip())}$", "$options": "i"}}
    doc = db["districts"].find_one(q, {"_id": 1})
    if not doc:
        raise ValueError("District not found")
    return doc["_id"]

def resolve_taluka_oid(db, taluka_name: str) -> ObjectId:
    q = {"taluka": {"$regex": f"^{re.escape(taluka_name.strip())}$", "$options": "i"}}
    doc = db["talukas"].find_one(q, {"_id": 1})
    if not doc:
        raise ValueError("Taluka not found")
    return doc["_id"]

def resolve_city_oid(db, city_name: str) -> ObjectId:
    q = {"city": {"$regex": f"^{re.escape(city_name.strip())}$", "$options": "i"}}
    doc = db["cities"].find_one(q, {"_id": 1})
    if not doc:
        raise ValueError("City not found")
    return doc["_id"]

# ----------- Core builder (param: field in students collection) -----------
def _build_region_dataframe(db, student_filter: Dict[str, ObjectId], fees_months_denom: int = 12) -> pd.DataFrame:
    cur = db["students"].find(
        student_filter,
        {"_id": 1, "AttendancePercentage": 1, "Reasons": 1, "RollNumber": 1, "Name": 1},
    )
    students = list(cur)
    if not students:
        return pd.DataFrame(columns=["StudentID", "StudentLabel", "Attendance_Rate", "Test_Score", "Fees", "Reason"])

    def _mask_name(name: str) -> str:
        if not isinstance(name, str) or not name.strip():
            return ""
        parts = name.strip().split()
        if len(parts) == 1:
            word = parts[0]
            return word[:1].upper() + word[1:].lower()
        first, last = parts[0], parts[-1]
        return f"{first[:1].upper()}{first[1:].lower()} {last[:1].upper()}."

    student_ids = [s["_id"] for s in students]
    base = {}
    for s in students:
        sid_obj = s["_id"]
        sid_str = str(sid_obj)
        roll = (s.get("RollNumber") or "").strip()
        name = (s.get("Name") or "").strip()
        if roll:
            label = str(roll)
        elif name:
            label = _mask_name(name)
        else:
            label = f"Student-{sid_str[-4:]}"
        base[sid_obj] = {
            "StudentID": sid_str,
            "StudentLabel": label,
            "Attendance_Rate": float(s.get("AttendancePercentage", 0.0) or 0.0),
            "Reason": s.get("Reasons") or "",
        }

    # marks
    st_set = set(student_ids)
    marks_map = {}
    for doc in db["marks"].find({"Students.Student1": {"$in": student_ids}}, {"Students": 1}):
        for row in doc.get("Students", []):
            st_id = row.get("Student1")
            if st_id in st_set:
                m = row.get("marks") or {}
                avg = _avg_test_score_from_marks(m)
                if np.isfinite(avg):
                    marks_map.setdefault(st_id, []).append(avg)
    for oid in base.keys():
        base[oid]["Test_Score"] = float(np.mean(marks_map[oid])) if oid in marks_map else 0.0

    # fees
    fees_by_student = {}
    for fdoc in db["fees"].find({"Students.student_id": {"$in": student_ids}}, {"Students": 1}):
        for s in fdoc.get("Students", []):
            st = s.get("student_id")
            if st in st_set:
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

# ----------- Entry points for each region -----------
def predict_for_district(db, district_oid: ObjectId, fees_months_denom: int = 12) -> Dict[str, Any]:
    df = _build_region_dataframe(db, {"District": district_oid}, fees_months_denom)
    return {"count": 0, "results": []} if df.empty else to_api_payload(run_prediction_pipeline(df))

def predict_for_taluka(db, taluka_oid: ObjectId, fees_months_denom: int = 12) -> Dict[str, Any]:
    df = _build_region_dataframe(db, {"Taluka": taluka_oid}, fees_months_denom)
    return {"count": 0, "results": []} if df.empty else to_api_payload(run_prediction_pipeline(df))

def predict_for_city(db, city_oid: ObjectId, fees_months_denom: int = 12) -> Dict[str, Any]:
    df = _build_region_dataframe(db, {"City": city_oid}, fees_months_denom)
    return {"count": 0, "results": []} if df.empty else to_api_payload(run_prediction_pipeline(df))
