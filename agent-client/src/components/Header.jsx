import React from "react";
import { Briefcase } from "lucide-react";

const Header = () => (
  <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-teal-600 p-2 rounded-lg">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">JobHunter AI</h1>
      </div>
      <div className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
        Powered by LangChain + Gemini
      </div>
    </div>
  </header>
);

export default Header;
