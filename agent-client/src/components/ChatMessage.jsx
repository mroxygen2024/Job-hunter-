import React from "react";
import { User, Bot, ExternalLink } from "lucide-react";

const ChatMessage = ({ msg }) => (
  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-teal-600 text-white" : "bg-gray-800 text-white"}`}>
        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex flex-col space-y-2">
        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
          msg.role === "user"
            ? "bg-teal-600 text-white rounded-tr-none"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
        }`}>
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs">
            <span className="font-semibold text-gray-500 mb-2 block uppercase tracking-wider text-[10px]">Sources Found</span>
            <div className="grid gap-2">
              {msg.sources.map((source, sIdx) => (
                <a key={sIdx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-teal-600 hover:text-teal-800 hover:bg-teal-50 p-1.5 rounded transition-colors truncate">
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

export default ChatMessage;
