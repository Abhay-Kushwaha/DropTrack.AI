# ML_Apps/summary.py
"""
To summarize prediction results for counselors.
Usage:
    from .gemini_helper import generate_gemini_insights
    text, status = generate_gemini_insights(results=payload["results"], school_label="Jaipur Public School")

Return:
    (insights_text_or_None, status_str)
    where status_str in {"ok","sdk_missing","api_key_missing","error"}

Safety:
- Uses StudentLabel only (never the Mongo ObjectId).
- Redacts any 24-hex patterns if they appear in the model response.
"""

from typing import Optional, Tuple, Dict, Any, List
import os
import re

# Try to import the SDK; handle missing dependency gracefully
try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except Exception:
    _HAS_GEMINI = False

# Redact 24-hex substrings (Mongo ObjectId-like)
_HEX24_RE = re.compile(r"\b[a-f0-9]{24}\b", flags=re.IGNORECASE)


def _format_student_line(r: Dict[str, Any]) -> str:
    """
    Build a single bullet line for Gemini prompt using ONLY StudentLabel.
    Expected keys in r: StudentLabel, Risk_Level, Risk_Score, Dropout_Probability, Dropout_Reason
    """
    label = r.get("StudentLabel") or "Student"
    risk_level = r.get("Risk_Level", "?")
    risk_score = r.get("Risk_Score", 0)
    prob = r.get("Dropout_Probability", 0.0)
    why = r.get("Dropout_Reason", "n/a")
    # Ensure types/formatting
    try:
        risk_score = f"{float(risk_score):.0f}"
    except Exception:
        risk_score = str(risk_score)
    try:
        prob = f"{float(prob):.2f}"
    except Exception:
        prob = str(prob)

    return f"- {label}: Risk={risk_level} Score={risk_score} P={prob} Why: {why}"


def generate_gemini_insights(
    results: List[Dict[str, Any]],
    school_label: Optional[str] = None,
    max_students: int = 10,
    max_chars: int = 1800,
) -> Tuple[Optional[str], str]:
    """
    Create a compact, actionable counselor brief using Gemini based on model outputs.

    Args:
        results: list of per-student dicts from your API (must include StudentLabel).
        school_label: friendly name shown in the brief (e.g., "Jaipur Public School").
        max_students: cap the number of students passed into the prompt.
        max_chars: hard character limit for the returned text.

    Returns:
        (insights_text_or_None, status_str)
    """
    if not _HAS_GEMINI:
        return None, "sdk_missing"

    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None, "api_key_missing"

    model_name = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

    # Sort: High/Medium first, by probability desc, then score
    sorted_rows = sorted(
        results or [],
        key=lambda r: (
            (r.get("Predicted_Risk_Level") in ("High", "Medium")),
            float(r.get("Dropout_Probability", 0.0) or 0.0),
            float(r.get("Risk_Score", 0.0) or 0.0),
        ),
        reverse=True,
    )[: max(1, int(max_students))]

    bullets = "\n".join(_format_student_line(r) for r in sorted_rows)
    sname = (school_label or "this school").strip()

    prompt = f"""
        You are an academic counselor assistant. Given per-student dropout risk outputs,
        write a concise, actionable brief for {sname}.
        
        Columns: StudentLabel, Risk_Level, Risk_Score (0-100), Dropout_Probability (0-1), Dropout_Reason.
        Focus on: 1) who needs help first, 2) why, 3) clear next actions for mentors/parents,
        4) keep it short with bullet points, 5) avoid any PII beyond the given labels.
        
        Students (top {len(sorted_rows)} by risk):
        {bullets}
        
        Output structure (STRICT):
        1) One-sentence overview.
        2) Top 3-5 priority interventions (bullets).
        3) Communication tips for parents/students (bullets).
        4) Monitoring plan for next 2 weeks (bullets).
        
        Hard limit ~{int(max_chars)} characters. Avoid repeating the raw data verbatim.
        """.strip()
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        resp = model.generate_content(prompt)
        text = (resp.text or "").strip()
        # Redact any accidental 24-hex ids and enforce length
        text = _HEX24_RE.sub("Student", text)
        if len(text) > max_chars:
            text = text[: max_chars - 1] + "…"
        return text, "ok"
    except Exception:
        return None, "error"
