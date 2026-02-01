import os
import time
import traceback
from typing import Annotated
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict
from prompts.main_agent_sys_prompt import SYSTEM_PROMPT
from langsmith import traceable

load_dotenv()

# FastAPI app setup
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    session_id: str

gemini_api_key = os.getenv('GEMINI_API_KEY')

# State schema for managing conversation messages
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=gemini_api_key,
    temperature=0.7,
)

agent = create_agent(gemini_model, system_prompt=SYSTEM_PROMPT)

# Create the graph
graph_builder = StateGraph(AgentState)

def chat_node(state: AgentState) -> AgentState:
    """Process messages through the agent."""
    response = agent.stream(
        {"messages": state["messages"]},
        stream_mode="messages",
    )
    
    full_response = ""
    for token, metadata in response:
        if hasattr(token, 'content') and token.content:
            full_response += token.content
        elif hasattr(token, 'content_blocks'):
            for block in token.content_blocks:
                full_response += str(block)
    
    if full_response:
        return {"messages": [AIMessage(content=full_response)]}
    return {"messages": []}

# Add nodes to the graph
graph_builder.add_node("chat", chat_node)
graph_builder.add_edge(START, "chat")
graph_builder.add_edge("chat", END)

# Compile the graph
graph = graph_builder.compile()

# Store conversation state per session
conversation_states = {}

@traceable(name="agent")
def process_chat(user_message: str, session_id: str) -> tuple[str, dict]:
    """Process a chat message through the agent with LangSmith tracing."""
    # Initialize or get existing conversation state
    if session_id not in conversation_states:
        conversation_states[session_id] = AgentState(messages=[])
    
    conversation_state = conversation_states[session_id]
    
    # Add user message
    conversation_state["messages"].append(HumanMessage(content=user_message))
    
    # Get agent response
    output = graph.invoke(conversation_state)
    conversation_state["messages"].extend(output["messages"])
    
    # Extract the last AI message
    ai_response = None
    if output["messages"]:
        last_msg = output["messages"][-1]
        ai_response = last_msg.content if hasattr(last_msg, 'content') else str(last_msg)
    
    if not ai_response:
        raise ValueError("No response from agent")
    
    return ai_response, {"session_id": session_id}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Handle chat messages."""
    try:
        user_message = request.message.strip()
        session_id = request.session_id
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Empty message")
        
        # Process through traced function
        ai_response, metadata = process_chat(user_message, session_id)
        
        return ChatResponse(
            response=ai_response,
            session_id=session_id
        )
            
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"Chat error: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}

def journaling_conversation():
    """Run an interactive journaling conversation with the agent (CLI mode)."""
    conversation_state = AgentState(messages=[])
    
    print("\n🌿 Welcome to Trace - Your Journaling Companion 🌿")
    print("=" * 50)
    print("Tell me about your day. Type 'quit' to exit.\n")
    
    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("\nTrace: Thank you for sharing today. Take care of yourself. 💫")
                break
            
            if not user_input:
                continue
            
            # Add user message to state
            conversation_state["messages"].append(HumanMessage(content=user_input))
            
            # Stream response from agent
            print("\nTrace: ", end="", flush=True)
            
            try:
                # Process through the graph
                output = graph.invoke(conversation_state)
                conversation_state["messages"].extend(output["messages"])
                
            except Exception as e:
                if "429" in str(e) or "too many requests" in str(e).lower():
                    print("\n⏳ Rate limit reached. Waiting before retry...")
                    time.sleep(5)  # Wait 5 seconds before retrying
                    print("You: ", end="")
                    continue
                else:
                    raise
            
            print("\n")
            
        except KeyboardInterrupt:
            print("\n\nTrace: Until next time. Take care! 💫")
            break
        except Exception as e:
            print(f"\nError: {e}")
            print("Please try again.\n")

if __name__ == "__main__":
    import sys
    import uvicorn
    
    # Check if CLI mode is requested
    if "--cli" in sys.argv:
        journaling_conversation()
    else:
        # Run as FastAPI server (default)
        uvicorn.run(app, host="0.0.0.0", port=3001)


