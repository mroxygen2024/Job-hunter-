import React from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const FileUpload = ({ file, handleFileChange, handleParseResume, isParsing, error }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
    <div className="p-5 border-b border-gray-200 bg-gray-50/50">
      <h2 className="font-semibold text-gray-800 flex items-center">
        <FileText className="w-4 h-4 mr-2 text-teal-600" />
        Resume Upload
      </h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all group">
          <div className="bg-teal-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-teal-600" />
          </div>
          <label htmlFor="resume-upload" className="cursor-pointer">
            <span className="text-sm font-medium text-teal-700 hover:underline">Click to upload</span>
            <span className="text-sm text-gray-500"> or drag PDF/TXT here</span>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">Max file size 5MB</p>
        </div>

        {file && (
          <div className="flex items-center justify-between bg-teal-50 text-teal-800 px-4 py-3 rounded-lg border border-teal-100">
            <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
            <CheckCircle className="w-4 h-4 text-teal-600" />
          </div>
        )}

        <button
          onClick={handleParseResume}
          disabled={!file || isParsing}
          className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-all flex justify-center items-center"
        >
          {isParsing ? "Analyzing Resume..." : "Parse Resume"}
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

export default FileUpload;
