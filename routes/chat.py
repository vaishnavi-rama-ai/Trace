"""Chat routes."""
import traceback
import random
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database import User, JournalEntry, get_db
from auth import get_current_user
from models import ChatRequest, ChatResponse
from agent_core import process_chat
from prompt_tool import prompts

router = APIRouter(tags=["chat"])


@router.get("/random-prompt")
async def get_random_prompt():
    """Get a random journaling prompt."""
    return {"prompt": random.choice(prompts)}


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Handle chat messages."""
    try:
        user_message = request.message.strip()
        session_id = request.session_id
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Empty message")
        
        # Process through traced function
        ai_response, metadata = process_chat(user_message, session_id)
        
        # Save to database with authenticated user
        journal_entry = JournalEntry(
            user_id=current_user.id,
            session_id=session_id,
            user_message=user_message,
            ai_response=ai_response
        )
        db.add(journal_entry)
        db.commit()
        
        return ChatResponse(
            response=ai_response,
            session_id=session_id
        )
            
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"Chat error: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)
