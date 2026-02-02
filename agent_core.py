"""AI agent and chat processing logic."""
import json
import random
from typing import Annotated, Tuple, Dict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain.agents.middleware import SummarizationMiddleware
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict
from langsmith import traceable
import os

from prompts.main_agent_sys_prompt import SYSTEM_PROMPT
from prompts.input_validation_prompt import INPUT_VALIDATION_PROMPT
from prompts.summary_prompt import SUMMARY_PROMPT
from prompt_tool import prompts

gemini_api_key = os.getenv('GEMINI_API_KEY')



# ==================== Input Validation ====================

class InputValidationResult(TypedDict):
    is_valid: bool
    reason: str
    should_continue: bool


# LLM Model setup
gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=gemini_api_key,
    temperature=0.7,
)

# Validation LLM (lower temperature for consistency)
validation_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

@tool
def get_a_prompt() -> str:
    """Generate a random journaling prompt to inspire reflection and self-discovery."""
    return random.choice(prompts)

# Create agent with summarization middleware built-in
agent = create_agent(
    model=gemini_model, 
    tools=[get_a_prompt],
    system_prompt=SYSTEM_PROMPT,
    middleware=[
        SummarizationMiddleware(
            model=validation_model,
            summary_prompt = SUMMARY_PROMPT,
            trigger=("tokens", 60000),
            keep=("messages", 20),  
        )
    ]
)


def validate_user_input(user_message: str) -> InputValidationResult:
    """
    Validate user input using LLM to check if it's appropriate for journaling.
    Returns whether the input should be processed.
    
    This function:
    1. Checks for spam, gibberish, or empty messages
    2. Ensures input expresses some thought/feeling/reflection
    3. Uses the validation LLM for intelligent filtering
    """
  
    prompt = INPUT_VALIDATION_PROMPT.format(
        user_message = user_message,
    )
    
    try:
        response = validation_model.invoke([HumanMessage(content=prompt)])
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        # Parse JSON response
        # Try to extract JSON from response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start != -1 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            validation_result = json.loads(json_str)
            
            return InputValidationResult(
                is_valid=validation_result.get("is_valid", True),
                reason=validation_result.get("reason", ""),
                should_continue=validation_result.get("is_valid", True)
            )
        else:
            # If JSON parsing fails, do basic validation
            return InputValidationResult(
                is_valid=len(user_message.strip()) > 0,
                reason="Basic validation passed",
                should_continue=len(user_message.strip()) > 0
            )
    except Exception as e:
        print(f"Warning: Input validation failed with error: {e}, allowing message through")
        # If validation fails, be permissive and allow the message
        return InputValidationResult(
            is_valid=len(user_message.strip()) > 0,
            reason="Validation service unavailable",
            should_continue=len(user_message.strip()) > 0
        )


# ==================== Agent State and Graph ====================

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    validation_passed: bool
    validation_reason: str


graph_builder = StateGraph(AgentState)


def input_validation_node(state: AgentState) -> AgentState:
    """
    Input validation node that runs before the main agent.
    
    This node:
    1. Checks if the most recent message is a human message
    2. Validates the input using the LLM-based validator
    3. Sets validation state flags for routing
    """
    if not state["messages"]:
        return state
    
    last_message = state["messages"][-1]
    
    # Only validate human messages
    if not isinstance(last_message, HumanMessage):
        return state
    
    user_input = last_message.content
    validation_result = validate_user_input(user_input)
    
    print(f"[Input Validation] Message: {user_input[:50]}... | Valid: {validation_result['should_continue']} | Reason: {validation_result['reason']}")
    
    return {
        **state,
        "validation_passed": validation_result["should_continue"],
        "validation_reason": validation_result["reason"]
    }


def chat_node(state: AgentState) -> AgentState:
    """
    Chat node that processes messages through the agent with summarization middleware.
    
    This node:
    1. Checks if input validation passed
    2. Uses the agent with built-in summarization middleware
    3. Returns the agent's response or validation error message
    """
    # Check if validation passed
    if not state.get("validation_passed", True):
        reason = state.get("validation_reason", "Invalid input")
        error_response = f"I couldn't process that input. {reason}"
        return {"messages": [AIMessage(content=error_response)]}
    
    # Process through agent with summarization middleware built-in
    response = agent.stream(
        {"messages": state["messages"]},
        stream_mode="messages",
    )
    
    full_response = ""
    for token, metadata in response:
        # Handle different response formats
        if isinstance(token, dict):
            # Handle dict response (like {'type': 'text', 'text': '...', 'extras': {...}})
            if 'text' in token:
                full_response += token['text']
            elif 'content' in token:
                full_response += token['content']
        elif hasattr(token, 'content') and token.content:
            # Handle content that could be a string or a list
            if isinstance(token.content, str):
                full_response += token.content
            elif isinstance(token.content, list):
                for item in token.content:
                    if isinstance(item, dict) and 'text' in item:
                        full_response += item['text']
                    else:
                        full_response += str(item)
        elif hasattr(token, 'content_blocks'):
            for block in token.content_blocks:
                full_response += str(block)
    
    if full_response:
        return {"messages": [AIMessage(content=full_response)]}
    return {"messages": []}


def should_continue_to_chat(state: AgentState) -> str:
    """
    Conditional routing function: proceed to chat only if validation passed.
    """
    if state.get("validation_passed", True):
        return "chat"
    else:
        return "end"


# Add nodes to the graph
graph_builder.add_node("input_validation", input_validation_node)
graph_builder.add_node("chat", chat_node)

# Add edges with validation check
# graph_builder.add_edge(START, "input_validation")
# graph_builder.add_conditional_edges(
#     "input_validation",
#     should_continue_to_chat,
#     {"chat": "chat", "end": END}
# )
graph_builder.add_edge(START, "chat")
graph_builder.add_edge("chat", END)

# Compile the graph
graph = graph_builder.compile()

# Store conversation state per session
conversation_states = {}


@traceable(name="agent")
def process_chat(user_message: str, session_id: str) -> Tuple[str, Dict]:
    """Process a chat message through the agent with LangSmith tracing."""
    try:
        # Initialize or get existing conversation state
        if session_id not in conversation_states:
            conversation_states[session_id] = AgentState(
                messages=[],
                validation_passed=True,
                validation_reason=""
            )
        
        conversation_state = conversation_states[session_id]
        
        # Add user message
        conversation_state["messages"].append(HumanMessage(content=user_message))
        
        # Get agent response (includes validation and chat nodes)
        output = graph.invoke(conversation_state)
        conversation_state["messages"].extend(output["messages"])
        
        # Extract the last AI message
        ai_response = None
        if output["messages"]:
            last_msg = output["messages"][-1]
            ai_response = last_msg.content if hasattr(last_msg, 'content') else str(last_msg)
        
        if not ai_response:
            print("[ERROR] No response from agent - output:", output)
            raise ValueError("No response from agent")
        
        return ai_response, {"session_id": session_id}
    except Exception as e:
        print(f"[ERROR] process_chat failed: {type(e).__name__}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise
