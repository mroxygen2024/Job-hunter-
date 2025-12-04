import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import ParsedDataView from "./components/ParsedDataView";
import ChatMessage from "./components/ChatMessage";
import { fileToBase64 } from "./utils/fileUtils";
import { parseResume, chatMessage } from "./api/api";

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
      const data = await parseResume(base64);
      console.log("Parse Resume Response:", data);
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
      const data = await chatMessage(sessionId, userMsg);
      setMessages((prev) => [...prev, { role: "model", content: data.text || "No response", sources: data.sources || [] }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", content: "Sorry, I encountered an error while searching for jobs. Please try again." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans selection:bg-teal-100">
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

        <div className="lg:col-span-7 h-[600px] lg:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">
          {/* Chat header, messages, input */}
          <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center z-10">
            <h2 className="font-semibold text-gray-800 flex items-center">Job Hunter Assistant</h2>
            {parsedData && (
              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full flex items-center">
                <span className="w-2 h-2 bg-teal-600 rounded-full mr-1.5"></span>
                Context Active
              </span>
            )}
          </div>

          {!parsedData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
              <p className="max-w-xs text-sm">Upload and parse a resume to activate the Job Hunter AI agent.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
                    placeholder="E.g., Find me remote frontend developer jobs in Canada..."
                    className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm shadow-inner"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isSending}
                    className="absolute right-2 p-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg transition-colors shadow-sm"
                  >
                    Send
                  </button>
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
