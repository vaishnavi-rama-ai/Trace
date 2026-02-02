"""Journal and chat session routes."""
import time
import random
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import User, JournalEntry, get_db
from auth import get_current_user
from prompt_tool import prompts
from trace_analysis import get_analysis_summary
# from sentiment_service import SentimentAnalyzer

# Initialize sentiment analyzer
# sentiment_analyzer = SentimentAnalyzer()

router = APIRouter(prefix="/api", tags=["journal"])


# ==================== Request/Response Models ====================

class SentimentRequest(BaseModel):
    """Request model for sentiment analysis."""
    text: str


class SentimentResponse(BaseModel):
    """Response model for sentiment analysis."""
    all_sentiments: dict
    primary_sentiments: list
    confidence: float


# ==================== Sentiment Analysis Endpoints ====================

@router.post("/sentiment/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment of text.
    
    Args:
        request: SentimentRequest with text field
        
    Returns:
        SentimentResponse with sentiment scores and classifications
    """
    raise HTTPException(status_code=501, detail="Sentiment analysis is currently disabled")
    # if not request.text or not request.text.strip():
    #     raise HTTPException(status_code=400, detail="Text cannot be empty")
    # 
    # try:
    #     scores = sentiment_analyzer.analyze(request.text)
    #     result = sentiment_analyzer.format_results(scores)
    #     return SentimentResponse(**result)
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Sentiment analysis error: {str(e)}"
    #     )


@router.post("/sentiment/entry/{entry_id}")
async def analyze_entry_sentiment(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze sentiment of a stored journal entry.
    
    Args:
        entry_id: ID of journal entry to analyze
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Sentiment analysis results for the entry
    """
    raise HTTPException(status_code=501, detail="Sentiment analysis is currently disabled")
    # entry = db.query(JournalEntry).filter(
    #     JournalEntry.id == entry_id,
    #     JournalEntry.user_id == current_user.id
    # ).first()
    # 
    # if not entry:
    #     raise HTTPException(status_code=404, detail="Entry not found")
    # 
    # try:
    #     scores = sentiment_analyzer.analyze(entry.user_message)
    #     result = sentiment_analyzer.format_results(scores)
    #     
    #     return {
    #         "entry_id": entry_id,
    #         "user_message": entry.user_message,
    #         **result
    #     }
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Sentiment analysis error: {str(e)}"
    #     )


@router.get("/sentiment/session/{session_id}")
async def analyze_session_sentiment(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze aggregate sentiment for a chat session.
    
    Args:
        session_id: Chat session ID
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Aggregate sentiment analysis for the session
    """
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.session_id == session_id,
        JournalEntry.user_message != ""  # Only analyze user messages
    ).all()
    
    if not entries:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        # Aggregate sentiment scores across all messages
        all_scores = []
        for entry in entries:
            if entry.user_message.strip():
                scores = sentiment_analyzer.analyze(entry.user_message)
                all_scores.append(scores)
        
        # Average the scores
        if not all_scores:
            raise ValueError("No valid messages in session")
        
        avg_scores = {}
        for sentiment in sentiment_analyzer.group_names:
            avg_score = sum(s[sentiment] for s in all_scores) / len(all_scores)
            avg_scores[sentiment] = avg_score
        
        result = sentiment_analyzer.format_results(avg_scores)
        
        return {
            "session_id": session_id,
            "message_count": len(entries),
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Session sentiment analysis error: {str(e)}"
        )


@router.get("/journal")
async def get_journal_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0
):
    """Get user's journal entries."""
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).order_by(JournalEntry.created_at.desc()).offset(offset).limit(limit).all()
    
    return {
        "entries": entries,
        "total": db.query(JournalEntry).filter(
            JournalEntry.user_id == current_user.id
        ).count()
    }


@router.get("/chat-sessions")
async def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's chat sessions grouped by session_id."""
    # Get unique sessions with their metadata
    sessions = db.query(
        JournalEntry.session_id,
        func.min(JournalEntry.created_at).label('created_at'),
        func.max(JournalEntry.created_at).label('updated_at'),
        func.count(JournalEntry.id).label('message_count')
    ).filter(
        JournalEntry.user_id == current_user.id
    ).group_by(
        JournalEntry.session_id
    ).order_by(
        func.max(JournalEntry.created_at).desc()
    ).all()
    
    result = []
    for session in sessions:
        # Get the first non-empty user message for the title
        first_user_msg = db.query(JournalEntry).filter(
            JournalEntry.user_id == current_user.id,
            JournalEntry.session_id == session.session_id,
            JournalEntry.user_message != ""
        ).order_by(JournalEntry.created_at.asc()).first()
        
        # Create title from first user message, or use default
        if first_user_msg and first_user_msg.user_message.strip():
            title = first_user_msg.user_message[:50]
            if len(first_user_msg.user_message) > 50:
                title = title + "..."
        else:
            title = "Chat"
        
        result.append({
            "session_id": session.session_id,
            "title": title,
            "created_at": session.created_at,
            "updated_at": session.updated_at,
            "message_count": session.message_count
        })
    
    return {"sessions": result}


@router.post("/chat-sessions/create")
async def create_chat_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session."""
    session_id = f"session_{current_user.id}_{int(time.time() * 1000)}"
    
    # Get a random prompt for the greeting
    greeting_prompt = random.choice(prompts)
    greeting_message = f"Hi! I'm Trace, your journaling companion. Here's something to think about today: {greeting_prompt}"
    
    # Create an initial entry to establish the session with the greeting message
    initial_entry = JournalEntry(
        user_id=current_user.id,
        session_id=session_id,
        user_message="",  # Empty, this is just to create the session
        ai_response=greeting_message
    )
    db.add(initial_entry)
    db.commit()
    db.refresh(initial_entry)
    
    return {
        "session_id": session_id,
        "created_at": initial_entry.created_at
    }


@router.get("/chat-history/{session_id}")
async def get_chat_history(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat history for a specific session."""
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.session_id == session_id
    ).order_by(JournalEntry.created_at.asc()).all()
    
    if not entries:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = []
    for entry in entries:
        # Include all entries: even the initial empty user_message should show the AI greeting
        messages.append({
            "id": entry.id,
            "user_message": entry.user_message,
            "ai_response": entry.ai_response,
            "created_at": entry.created_at
        })
    
    return {
        "session_id": session_id,
        "messages": messages
    }


@router.delete("/chat-sessions/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a chat session and all its entries."""
    print(f"[DELETE] Attempting to delete session: {session_id} for user: {current_user.id}")
    
    # Delete all entries for this session belonging to the current user
    deleted_count = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.session_id == session_id
    ).delete()
    
    db.commit()
    
    print(f"[DELETE] Deleted {deleted_count} entries for session {session_id}")
    
    if deleted_count == 0:
        print(f"[DELETE] No entries found for session {session_id}")
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "message": "Session deleted successfully",
        "deleted_entries": deleted_count
    }


@router.get("/analysis")
async def get_journal_analysis(
    current_user: User = Depends(get_current_user),
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Get AI-powered analysis of user's journal entries.
    
    Args:
        current_user: Authenticated user
        days: Number of days to analyze (default: 30)
        db: Database session
    
    Returns:
        Analysis summary with insights
    """
    try:
        analysis = get_analysis_summary(user_id=current_user.id, days=days, db=db)
        
        if not analysis["success"]:
            raise HTTPException(
                status_code=400,
                detail=analysis.get("message", "Unable to generate analysis")
            )
        
        return analysis
    
    except HTTPException:
        raise
    except ValueError as e:
        print(f"Configuration error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Server configuration error. Please contact support."
        )
    except Exception as e:
        print(f"Error generating analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error generating analysis: {str(e)}"
        )
