# Trace - AI Journaling Companion

A full-stack journaling companion built with LangChain, FastAPI, and React.

## Project Structure

```
Trace/
├── agent.py                      # FastAPI backend + CLI agent
├── prompts/
│   └── main_agent_sys_prompt.py  # System prompt for the agent
├── screens/
│   ├── LoginScreen.jsx           # Login/Register screen
│   └── ChatScreen.jsx            # Main chat interface
├── components/
│   ├── ChatHeader.jsx            # Chat header with logout
│   ├── MessageBubble.jsx         # Individual message component
│   ├── MessageInput.jsx          # Message input form
│   ├── MessageList.jsx           # Message list container
│   └── TraceLogo.jsx             # Logo component
├── public/
│   └── index.html                # HTML entry point
├── src/
│   ├── index.jsx                 # React app entry point
│   └── index.css                 # Global styles
├── App.jsx                       # Main React component
├── package.json                  # NPM dependencies
├── pyproject.toml                # Python dependencies
├── .env.example                  # Environment variables template
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js 16+ 
- Python 3.12+
- Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   uv sync
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run as FastAPI backend (default):**
   ```bash
   python agent.py
   ```
   
   The backend will start on `http://localhost:3001`

4. **Or run in CLI mode:**
   ```bash
   python agent.py --cli
   ```
   
   This provides an interactive command-line journaling experience

### Frontend Setup

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will open at `http://localhost:3000`

## Quick Start

### Running Both Backend and Frontend

**Terminal 1 - Start Backend:**
```bash
python agent.py
```

**Terminal 2 - Start Frontend:**
```bash
npm start
```

Then open `http://localhost:3000` in your browser.

### Alternative: CLI Mode Only
```bash
python agent.py --cli
```


## API Endpoints

### POST `/chat`
Send a message to the agent.

**Request:**
```json
{
  "message": "I had a tough day today",
  "session_id": "default"
}
```

**Response:**
```json
{
  "response": "I'm sorry to hear it was tough. What happened that made it difficult?",
  "session_id": "default"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```


See `.env.example` for all available options:

```
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (Frontend)
REACT_APP_BACKEND_URL=http://localhost:3001
```

## Development

### Backend Development
- Edit `agent.py` for API changes or backend logic
- Edit `prompts/main_agent_sys_prompt.py` for agent behavior modifications
- Use `python agent.py --cli` to test CLI functionality

### Frontend Development
- Edit component files in `components/` and `screens/` folders
- Edit `App.jsx` for main app structure
- Edit `src/index.css` for global styling
- MUI theme can be customized in `App.jsx`

## Troubleshooting

### Backend Connection Issues
- Make sure backend is running: `python agent.py`
- Check that backend is on port 3001
- If port is busy, modify `agent.py` line with `uvicorn.run()` to use a different port
- Update `REACT_APP_BACKEND_URL` in frontend `.env` if using a different port

### Port Already in Use

**Backend (Port 3001):**
```python
# In agent.py, change the last line to:
uvicorn.run(app, host="0.0.0.0", port=3002)
```

Then update frontend `.env`:
```
REACT_APP_BACKEND_URL=http://localhost:3002
```

**Frontend (Port 3000):**
```bash
PORT=3002 npm start
```

### Missing Dependencies
- Backend: `uv sync` to install all Python dependencies
- Frontend: `npm install` to install all Node dependencies

### CORS Errors
- Backend should have CORS middleware enabled by default
- Ensure `REACT_APP_BACKEND_URL` matches the actual backend URL
- Check browser console for specific CORS error messages

### Rate Limiting (429 Errors)
- The app includes automatic rate limiting in the backend
- If you hit Gemini API rate limits, wait a few seconds and try again
- Check your Gemini API quota and plan

### API Key Issues
- Ensure `.env` file is in the project root (same directory as `agent.py`)
- Verify `GEMINI_API_KEY` is correctly set in `.env`
- Restart backend after changing `.env`

## License

MIT

