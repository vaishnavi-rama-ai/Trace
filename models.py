"""Pydantic models for request/response data structures."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """User registration model."""
    username: str = Field(..., min_length=3, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=255)
    language: str = "en"


class UserLogin(BaseModel):
    """User login model."""
    username: str
    password: str


class UserResponse(BaseModel):
    """User response model."""
    id: int
    username: str
    email: str
    full_name: str
    language: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Token response model."""
    access_token: str
    token_type: str
    user: UserResponse


class ChatRequest(BaseModel):
    """Chat request model."""
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    """Chat response model."""
    response: str
    session_id: str


class ChatHistoryResponse(BaseModel):
    """Chat history response model."""
    id: int
    user_message: str
    ai_response: str
    created_at: datetime
    session_id: Optional[str] = None
    
    class Config:
        from_attributes = True


class ChatSessionResponse(BaseModel):
    """Chat session response model."""
    session_id: str
    title: str
    created_at: datetime
    message_count: int
    
    class Config:
        from_attributes = True


class AnalysisResponse(BaseModel):
    """Journal analysis response model."""
    success: bool
    entry_count: int
    analysis_period_days: int
    timestamp: str
    insights: str
    message: Optional[str] = None
    
    class Config:
        from_attributes = True
