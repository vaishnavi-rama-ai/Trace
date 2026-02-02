"""Trace analysis module for analyzing user journal entries with LLM."""
import os
from typing import Optional
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from langsmith import traceable
from sqlalchemy.orm import Session

from database import JournalEntry, SessionLocal
from prompts.trace_analysis_prompt import TRACE_ANALYSIS_PROMPT

# Initialize LLM for analysis
gemini_api_key = os.getenv('GEMINI_API_KEY')
analysis_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=gemini_api_key,
    temperature=0.7,
)

@traceable
def get_user_journal_entries(
    user_id: int,
    days: int = 30,
    db: Optional[Session] = None
) -> list[dict]:
    """
    Retrieve user's journal entries from the database.
    
    Args:
        user_id: The user's ID
        days: Number of days to look back (default: 30)
        db: Database session (creates new one if not provided)
    
    Returns:
        List of journal entries with timestamp and content
    """
    if db is None:
        db = SessionLocal()
        should_close = True
    else:
        should_close = False
    
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Query journal entries
        entries = db.query(JournalEntry).filter(
            JournalEntry.user_id == user_id,
            JournalEntry.created_at >= start_date,
            JournalEntry.created_at <= end_date
        ).order_by(JournalEntry.created_at.desc()).all()
        
        # Format entries for analysis
        formatted_entries = [
            {
                "timestamp": entry.created_at.isoformat(),
                "user_message": entry.user_message,
                "ai_response": entry.ai_response,
                "id": entry.id
            }
            for entry in entries
        ]
        
        return formatted_entries
    
    finally:
        if should_close:
            db.close()


@traceable
def format_entries_for_analysis(entries: list[dict]) -> str:
    """
    Format journal entries into a prompt-friendly string.
    
    Args:
        entries: List of journal entry dictionaries
    
    Returns:
        Formatted string of entries
    """
    if not entries:
        return "No journal entries found for the specified period."
    
    formatted_text = f"Total entries analyzed: {len(entries)}\n\n"
    
    for i, entry in enumerate(entries, 1):
        formatted_text += f"--- Entry {i} ({entry['timestamp']}) ---\n"
        formatted_text += f"Your thoughts: {entry['user_message']}\n"
        formatted_text += f"Response: {entry['ai_response']}\n\n"
    
    return formatted_text


@traceable
def analyze_journal_entries(
    user_id: int,
    days: int = 30,
    db: Optional[Session] = None
) -> str:
    """
    Analyze user's journal entries using LLM with LangSmith tracing.
    
    Args:
        user_id: The user's ID
        days: Number of days to analyze (default: 30)
        db: Database session (creates new one if not provided)
    
    Returns:
        Analysis insights as a formatted string
    """
    # Get journal entries from database
    entries = get_user_journal_entries(user_id, days, db)
    
    # Format entries for the prompt
    formatted_entries = format_entries_for_analysis(entries)
    
    # Create the analysis prompt
    analysis_prompt = f"""{TRACE_ANALYSIS_PROMPT}
    Here are the journal entries to analyze:
    {formatted_entries}
    Please provide a thoughtful analysis of these entries, identifying the key patterns and insights."""
    
    # Invoke the model with tracing
    message = HumanMessage(content=analysis_prompt)
    response = analysis_model.invoke([message])
    
    return response.content


@traceable
def get_analysis_summary(
    user_id: int,
    days: int = 30,
    db: Optional[Session] = None
) -> dict:
    """
    Get a complete analysis summary including insights and metadata.
    
    Args:
        user_id: The user's ID
        days: Number of days to analyze (default: 30)
        db: Database session (creates new one if not provided)
    
    Returns:
        Dictionary containing analysis insights and metadata
    """
    entries = get_user_journal_entries(user_id, days, db)
    
    if not entries:
        return {
            "success": False,
            "message": "No journal entries found for analysis",
            "entry_count": 0,
            "insights": None
        }
    
    # Perform analysis
    insights = analyze_journal_entries(user_id, days, db)
    
    return {
        "success": True,
        "entry_count": len(entries),
        "analysis_period_days": days,
        "timestamp": datetime.utcnow().isoformat(),
        "insights": insights
    }