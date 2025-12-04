import React from "react";
import { User } from "lucide-react";

const ParsedDataView = ({ parsedData, reset }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden animate-fade-in">
    <div className="p-5 border-b border-gray-200 bg-gray-50/50">
      <h2 className="font-semibold text-gray-800 flex items-center">
        <User className="w-4 h-4 mr-2 text-teal-600" />
        Candidate Profile
      </h2>
    </div>
    <div className="p-6 space-y-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 block">Full Name</label>
        <div className="text-lg font-medium text-gray-900">{parsedData.name}</div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Top Skills</label>
        <div className="flex flex-wrap gap-2">
          {(parsedData.skills || []).map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Recent Experience</label>
        <div className="space-y-3">
          {(parsedData.experience || []).slice(0, 2).map((exp, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="font-medium text-gray-900 text-sm">{exp.title}</div>
              <div className="text-xs text-gray-600 flex justify-between mt-1">
                <span>{exp.company}</span>
                <span>{exp.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Education</label>
        {(parsedData.education || []).slice(0, 1).map((edu, i) => (
          <div key={i} className="text-sm text-gray-700">
            <span className="font-medium">{edu.degree}</span> at {edu.institution}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button onClick={reset} className="text-sm text-teal-600 hover:text-teal-700 underline">
          Upload different resume
        </button>
      </div>
    </div>
  </section>
);

export default ParsedDataView;
