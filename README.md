# **JobHunter AI – Resume Parser + Job Search Assistant**

JobHunter AI is a full-stack project that helps users upload their resume, extract structured information (name, skills, experience, education), and then chat with an AI agent that finds relevant job opportunities using real-time search.

It works like a mini “AI career copilot” powered by **LangChain + Gemini** on the backend and a polished **React + Tailwind** UI on the frontend.

---

## **Features**

### Resume Upload

- Accepts **PDF** and **TXT** files
- Converts file → Base64 → sends to backend
- Backend extracts:

  - **Name**
  - **Skills**
  - **Experience**
  - **Education**

### AI Candidate Profile

- Clean UI rendering of parsed resume
- Shows top skills, latest experience, education
- User can reset and re-upload

### Job Search Chatbot

- AI assistant that uses parsed resume context
- You can ask:

  - “Find me remote React jobs in Canada”
  - “Rewrite my CV summary”
  - “Suggest roles for my skillset”

### Smooth UI

- Auto-scroll chat
- Loading animations
- Clean components
- Works on mobile & desktop

---

## **Tech Stack**

### **Frontend**

- React (Vite)
- TailwindCSS
- Lucide Icons
- Fetch API
- FileReader API (for Base64)

### **Backend**

- Node.js / Express
- LangChain
- Gemini AI
- Job search APIs or web search tools( Tavily)

---

## **Project Structure**

```
src/
  App.jsx
  components/
    Header
    FileUpload
    ParsedDataView
    ChatMessage
  utils/
    fileToBase64.js
```

---

## ⚙️ **Environment Variables**

Create a `.env` file in the frontend:

```
VITE_API_BASE=http://localhost:4000
```

If not provided, the app defaults to `http://localhost:4000`.

---

## **How to Run the Frontend**

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## **API Endpoints Your Backend Must Provide**

### **1️⃣ Parse Resume**

`POST /parse-resume`

#### Request

```json
{
  "fileBase64": "<Base64 string>"
}
```

#### Response

```json
{
  "parsedData": {
    "name": "John Doe",
    "skills": ["React", "Node.js"],
    "experience": [
      { "title": "Frontend Dev", "company": "ABC", "duration": "2022-2024" }
    ],
    "education": [
      { "degree": "BSc Computer Science", "institution": "XYZ University" }
    ]
  },
  "sessionId": "session_12345"
}
```

---

### **2️⃣ Chat With Resume Context**

`POST /chat`

#### Request

```json
{
  "message": "Find me remote React jobs",
  "sessionId": "session_12345"
}
```

#### Response

```json
{
  "text": "Here are remote React roles...",
  "sources": [{ "uri": "https://example.com/job1", "title": "React Developer" }]
}
```

## **Main Workflow**

1. User uploads resume
2. File converted to Base64 in frontend
3. Backend parses and returns structured data
4. Profile view shows extracted info
5. Session starts
6. User can chat with AI job assistant
7. AI fetches real job listings & responds
8. User applies/reset/upload new resume anytime

---

## **Folder-Safe Commands**

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## **Contributing**

Feel free to open issues, suggest improvements, or refactor UI components.
PRs are always welcome.

---

## 📜 **License**

MIT - Use freely for personal or commercial projects.
