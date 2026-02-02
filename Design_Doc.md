## **Design Document: Trace \- A Journaling Companion**

## **Overview**

Trace is an AI-powered journaling companion that facilitates meaningful self-reflection through conversational interaction. The architecture is designed for scalability, maintainability, and seamless deployment across environments.

## **Feature Overview:**

### **1\. Journal with Trace**

An interactive journaling experience where an AI agent guides users through their thoughts using intelligent, contextual prompts that adapt based on responses, creating a conversational flow for deeper self-exploration. This feature is crucial because it eliminates blank page anxiety by providing structured prompts that help users begin writing, deepens self-reflection through AI-generated follow-up questions that explore thoughts users might have glossed over, builds consistency by making journaling feel like an engaging conversation rather than a chore, and becomes increasingly personalized over time as the AI learns user patterns and asks questions tailored to their specific journey and concerns. 

### **2\. Burn Journal**

A cathartic feature allowing users to write freely with the knowledge that their entry will be permanently destroyed when they press "Burn," with the visual metaphor of burning paper reinforcing the temporary, release-focused nature of the writing. This feature provides essential emotional release by offering a safe space for venting, processing trauma, or working through intense emotions without the burden of permanence, assures privacy so users feel comfortable being honest and vulnerable without concern about storage or analysis, delivers therapeutic value through the psychological closure that comes from the act of "burning" (similar to established therapeutic techniques), and reduces self-censorship by allowing users to write authentically without worrying about future judgment from others or even themselves.

### **3\. Trace Me**

An AI-powered analytics feature that reviews the user's journaling history and surfaces patterns, themes, and insights, with recency weighting to prioritize current mental states and concerns over older entries. This feature is invaluable because it provides pattern recognition that humans often miss in their own behavior and thinking, identifying recurring themes, triggers, or cycles that users might not notice themselves, visualizes growth by showing how concerns, mindset, and emotional patterns have evolved over time as tangible evidence of personal progress, transforms raw journaling data into actionable insights that can inform life decisions and self-improvement efforts, and crucially emphasizes recent entries to ensure the analysis reflects who the user is now rather than who they were months ago, making insights more relevant and immediately applicable.

### **4\. Sentiment Map**

A visual dashboard displaying sentiment analysis of journal entries, trained on a neural network to identify and categorize the emotional tone of writing, creating an at-a-glance emotional landscape of the user's journaling journey. This feature is important because it provides immediate emotional awareness that allows users to quickly assess their emotional trajectory without re-reading entries, making it easy to spot concerning trends like prolonged negative sentiment, offers motivational visualization where seeing positive sentiment patterns encourages users and validates that journaling is beneficially impacting their mood, serves as an early warning system where sudden shifts in sentiment patterns can alert users to emerging mental health concerns, and enables data-driven self-care by helping users correlate sentiment changes with life events, habits, or decisions to understand what impacts their wellbeing.

## **Major Architectural Decisions & Technical Architecture Overview**

### **1\. FastAPI Backend:** handles API endpoints that handle all client requests including chat interactions, user registration, and journal entry management.

**Benefits**: FastAPI's async-first design handles concurrent user sessions efficiently, provides built-in request/response validation through Pydantic models, includes production-ready features like CORS and health checks, and delivers the performance needed for AI application latency requirements.

## **2\. LangChain \+ LangGraph:**  build and orchestrate the AI agent that powers Journal with Trace prompts.

**Benefits:** LangChain offers model-agnostic design for easy switching between AI providers, standardized conversation state management, and composable workflows, while LangGraph adds stateful workflow management with explicit state transitions, real-time token streaming for responsive UX, and built-in observability that makes the agent architecture both flexible and maintainable.

## **3\. LangSmith:** Agent observability, tracing, and debugging of the conversational AI workflows**.**

**Benefits:** Built-in integration with LangGraph provides comprehensive tracing through decorators, enabling developers to monitor agent behavior, debug conversation flows, and optimize performance without implementing custom logging infrastructure.

## **4\. Google Gemini 2.5 Flash:** powering the conversational agent in Journal with Trace and generating insights for the Trace Me feature.

**Benefits:** Gemini Flash delivers an excellent performance-to-cost ratio for conversational AI, provides fast inference suitable for real-time chat, offers sufficient context window for full conversation history, includes multimodal capabilities for future features, and the 0.7 temperature setting balances creative empathetic responses with consistent conversational tone.

## **5\. Docker Containerization:** packaging and deploying backend and frontend services in isolated environments.

**Benefits:** Docker ensures environment consistency across development and production, isolates dependencies between services, enables horizontal scaling through multiple container instances, and simplifies CI/CD pipeline integration through multi-stage builds optimized for each service.

## **6\. PostgreSQL Database:**  Storing user registration data and journal entries with ACID-compliant persistence.

**Benefits:** PostgreSQL ensures data integrity critical for user trust in journaling applications, supports JSON for flexible conversation metadata and sentiment results, scales efficiently with growing users and historical data, and provides full-text search capabilities for future entry search features.

## **7\. CLI \+ API Dual Mode:**The agent runs through CLI for debugging and development, and through API for production web/mobile clients.

**Benefits:** CLI mode accelerates development by enabling local testing without frontend setup and provides direct response streaming for troubleshooting, while API mode delivers production-ready endpoints for actual client applications, giving developers flexibility across different stages of development.

## **8\. Rate Limiting & Retry Logic:** Managing API quota and handling rate limit responses from Gemini.

**Benefits:** Explicit 429 error detection with exponential backoff provides API resilience, prevents silent failures that degrade user experience, transparently communicates rate limits, and controls costs by managing usage against Gemini quota.

## **9\. Sentiment Analysis Pipeline:** training a neural network on journal entries to power the Sentiment Map feature.

**Benefits:** A separate modular architecture allows sentiment analysis to run independently or integrate with chat workflows, supporting both TensorFlow models and API-based approaches. The pipeline includes comprehensive data preprocessing, model selection, hyperparameter tuning, fine-tuning, and metric evaluation to ensure accurate sentiment classification, with future scalability to extract this as a microservice for distributed processing.

**Future Enhancements** 

1. **Multimodal Agent Capabilities (Speech & Image Support)**  
   Enhance the agent to support speech and image inputs, enabling more natural, multimodal interactions. This will allow users to communicate via voice, upload images for context-aware analysis, and receive richer, more intuitive responses from the agent.  
2. **LLM benchmarking and performance testing**   
   Implement systematic benchmarking and testing frameworks to evaluate different large language models across key metrics such as accuracy, latency, cost efficiency, and scalability. This will enable data-driven model selection, continuous performance comparison, and informed decisions when upgrading or introducing new LLMs.  
3. **Neural Network Optimization and Iterative Improvement**  
   Continue iterative enhancements on the underlying neural network for sentiment architecture, including continued model fine-tuning, performance optimization, and accuracy improvements. These iterations will focus on better contextual understanding, faster inference times, and improved scalability as usage grows.  
4. **Personally Identifiable Information (PII)** will be encrypted both at rest and in transit, further strengthening data protection and compliance with evolving privacy and security standards.

**Tech Stack**

| Component | Technology | Rationale |
| :---- | :---- | :---- |
| **Backend Framework** | FastAPI | High-performance, async-first framework ideal for AI-driven workloads with built-in request/response validation |
| **AI Orchestration** | LangChain \+ LangGraph | Enables stateful agent workflows, composability, and observability for complex multi-step reasoning |
| **LLM** | Google Gemini 2.5 Flash | Fast inference, cost-effective, and multimodal-ready for future speech and image support |
| **Database** | PostgreSQL | Reliable ACID compliance, strong relational integrity, JSON support, and horizontal scalability |
| **Containerization** | Docker \+ Docker Compose | Ensures environment consistency, simplifies local development, and supports CI/CD pipelines |
| **Frontend Framework** | React | Component-based UI, dynamic rendering, and seamless integration with WebSockets and APIs |
| **Session Management** | In-memory (Phase 1\) → Redis/PostgreSQL (Phase 2\) | Rapid development initially, with a clear path to distributed and scalable session handling |
| **Sentiment Analysis** | TensorFlow Neural Network | Specially Trained Neural Network for sentiment analysis  |

## **Security Considerations**

The application implements multiple layers of security following industry best practices to protect user data and prevent malicious attacks. API keys and sensitive credentials are stored in environment variables through `.env` files that are excluded from version control, CORS configuration restricts frontend origins to prevent cross-site attacks, and rate limiting with 429 error handling prevents API abuse while controlling costs. All API requests are validated through Pydantic models to ensure data integrity, and session isolation guarantees that each session\_id maintains an independent state with no cross-session data leakage. To mitigate prompt injection attacks according to OWASP best practices, the system implements carefully crafted system prompting that establishes clear behavioral boundaries for the AI agent and includes a guardrails input validation node that filters user inputs before processing. Additionally, any off-topic questions unrelated to journaling are automatically blocked by the validation layer, ensuring the AI remains focused on its intended purpose as a journaling companion and preventing potential misuse or exploitation of the conversational interface.

**Observability & Monitoring**   
The current system is handled through LangSmith traces, where all LLM interactions are automatically logged using the @traceable decorator, providing end-to-end visibility into agent behavior and decision paths. FastAPI request and response logs are captured via Uvicorn for API-level monitoring, while console output in CLI mode streams responses in real time to support local debugging and development. From a cost-optimization perspective, the system leverages the Gemini Flash model instead of higher-cost Pro variants, implements response caching for frequently repeated interaction patterns, batches sentiment analysis workloads during off-peak hours, and utilizes spot instances for non-critical batch processing to reduce infrastructure costs.

## **Privacy and Trust**

The agent is designed to be non-judgmental and empathetic, regardless of the content entered by the user. Through the use of rigorous system prompting and guardrails, the agent avoids bias, judgment, or dismissive responses and does not minimize or downplay the user’s emotions or experiences. None of the user-provided data used to generate personalized insights is reused to train or fine-tune AI models. All interactions are processed solely to deliver real-time responses and insights for the individual user. Additionally, user data is securely stored in a PostgreSQL database hosted within a protected environment that follows industry-standard security practices, including access controls and secure authentication mechanisms. Data access is restricted to authorized services only, ensuring strong protection against unauthorized access.

