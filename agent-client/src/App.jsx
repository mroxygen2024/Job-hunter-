import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  Briefcase,
  Search,
  Loader2,
  Send,
  User,
  Bot,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

// Backend URL
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

// Convert file to Base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** ------------------ Reusable Components ------------------ **/

const Header = () => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-indigo-600">
          JobHunter AI
        </h1>
      </div>
      <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
        Powered by LangChain + Gemini
      </div>
    </div>
  </header>
);

const FileUpload = ({ file, handleFileChange, handleParseResume, isParsing, error }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
      <h2 className="font-semibold text-slate-800 flex items-center">
        <FileText className="w-4 h-4 mr-2 text-blue-600" />
        Resume Upload
      </h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
          <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <label htmlFor="resume-upload" className="cursor-pointer">
            <span className="text-sm font-medium text-blue-700 hover:underline">Click to upload</span>
            <span className="text-sm text-slate-500"> or drag PDF/TXT here</span>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-slate-400 mt-2">Max file size 5MB</p>
        </div>

        {file && (
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-100">
            <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
        )}

        <button
          onClick={handleParseResume}
          disabled={!file || isParsing}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-all flex justify-center items-center"
        >
          {isParsing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            "Parse Resume"
          )}
        </button>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  </section>
);

const ParsedDataView = ({ parsedData, reset }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
      <h2 className="font-semibold text-slate-800 flex items-center">
        <User className="w-4 h-4 mr-2 text-blue-600" />
        Candidate Profile
      </h2>
    </div>
    <div className="p-6 space-y-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Full Name</label>
        <div className="text-lg font-medium text-slate-900">{parsedData.name}</div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Top Skills</label>
        <div className="flex flex-wrap gap-2">
          {(parsedData.skills || []).map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Recent Experience</label>
        <div className="space-y-3">
          {(parsedData.experience || []).slice(0, 2).map((exp, i) => (
            <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="font-medium text-slate-900 text-sm">{exp.title}</div>
              <div className="text-xs text-slate-600 flex justify-between mt-1">
                <span>{exp.company}</span>
                <span>{exp.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Education</label>
        {(parsedData.education || []).slice(0, 1).map((edu, i) => (
          <div key={i} className="text-sm text-slate-700">
            <span className="font-medium">{edu.degree}</span> at {edu.institution}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button onClick={reset} className="text-sm text-blue-600 hover:text-blue-700 underline">
          Upload different resume
        </button>
      </div>
    </div>
  </section>
);

const ChatMessage = ({ msg }) => (
  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-indigo-600 text-white"}`}>
        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex flex-col space-y-2">
        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"}`}>
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
            <span className="font-semibold text-slate-500 mb-2 block uppercase tracking-wider text-[10px]">Sources Found</span>
            <div className="grid gap-2">
              {msg.sources.map((source, sIdx) => (
                <a key={sIdx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition-colors truncate">
                  <ExternalLink className="w-3 h-3 mr-1.5 shrink-0" />
                  <span className="truncate">{source.title || source.uri}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/** ------------------ Main App ------------------ **/

const App = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const resetParsedData = () => {
    setParsedData(null);
    setFile(null);
    setMessages([]);
    setSessionId(null);
    setError(null);
  };

  const handleParseResume = async () => {
    if (!file) return setError("Please select a resume file (PDF or TXT).");

    setIsParsing(true);
    setError(null);

    try {
      const base64 = (await fileToBase64(file)).split(",")[1];

      const resp = await fetch(`${API_BASE}/parse-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64 }),
      });

      if (!resp.ok) throw new Error(await resp.text() || "Failed to parse resume");

      const data = await resp.json();
      if (!data?.parsedData) throw new Error("Invalid response from parser");

      setParsedData(data.parsedData);
      setSessionId(data.sessionId || null);

      setMessages([
        {
          role: "model",
          content: `Hello ${data.parsedData.name || "there"}! I've analyzed your resume. I see skills like ${(data.parsedData.skills || []).slice(0, 3).join(", ")}. How can I help you find your next role today?`,
        },
      ]);
    } catch (err) {
      setError("Failed to parse resume. " + (err.message || String(err)));
    } finally {
      setIsParsing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;
    const userMsg = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsSending(true);
    setError(null);

    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, sessionId }),
      });

      if (!resp.ok) throw new Error(await resp.text() || "Chat request failed");

      const data = await resp.json();
      setMessages((prev) => [...prev, { role: "model", content: data.text || "No response", sources: data.sources || [] }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", content: "Sorry, I encountered an error while searching for jobs. Please try again." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          {!parsedData && (
            <FileUpload
              file={file}
              handleFileChange={(e) => setFile(e.target.files[0])}
              handleParseResume={handleParseResume}
              isParsing={isParsing}
              error={error}
            />
          )}
          {parsedData && <ParsedDataView parsedData={parsedData} reset={resetParsedData} />}
        </div>

        <div className="lg:col-span-7 h-[600px] lg:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center z-10">
            <h2 className="font-semibold text-slate-800 flex items-center">
              <Search className="w-4 h-4 mr-2 text-blue-600" />
              Job Hunter Assistant
            </h2>
            {parsedData && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                Context Active
              </span>
            )}
          </div>

          {!parsedData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 opacity-50" />
              </div>
              <p className="max-w-xs text-sm">Upload and parse a resume to activate the Job Hunter AI agent.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm ml-11">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Researching jobs...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
                    placeholder="E.g., Find me remote frontend developer jobs in Canada..."
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-inner"
                    disabled={isSending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isSending}
                    className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <p className="text-[10px] text-slate-400">Backend does heavy-lifting. Verify job details before applying.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
