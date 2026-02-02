"""FastAPI application setup and initialization."""
import sys
import time
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import init_db
from routes import auth_router, chat_router, journal_router
from agent_core import AgentState, graph
from langchain_core.messages import HumanMessage

load_dotenv()

# FastAPI app setup
app = FastAPI(title="Trace - AI Journaling Companion")

# Initialize database
init_db()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(journal_router)


# ==================== Health Check ====================

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


# ==================== CLI Mode ====================

def journaling_conversation():
    """Run an interactive journaling conversation with the agent (CLI mode)."""
    conversation_state = AgentState(
        messages=[],
        validation_passed=True,
        validation_reason=""
    )
    
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
    # Check if CLI mode is requested
    if "--cli" in sys.argv:
        journaling_conversation()
    else:
        # Run as FastAPI server (default)
        uvicorn.run(app, host="0.0.0.0", port=3001)
