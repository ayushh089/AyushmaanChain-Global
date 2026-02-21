import React from "react";

const AccordionView = ({ groupedRecords }) => (
  <div className="space-y-3">
    {Object.keys(groupedRecords).map((fileType, i) => (
      <div
        key={i}
        className="border border-emerald-300/20 rounded-lg overflow-hidden"
      >
        <div className="bg-emerald-900/30 px-4 py-3 flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-medium text-white">{fileType}</h3>
          <span className="text-xs bg-emerald-800/50 text-emerald-300 px-2 py-1 rounded-full">
            {groupedRecords[fileType].length} records
          </span>
        </div>
        <div className="bg-white/5 divide-y divide-emerald-300/10">
          {groupedRecords[fileType].map((record, index) => (
            <div
              key={index}
              className="px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-colors"
            >
              <span className="text-sm text-green-100">{record.fileName}</span>
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default AccordionView;