import React from "react";

const TableView = ({ records }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-green-300/20">
      <thead className="bg-white/5">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            #
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            File Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            File Type
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white/5 divide-y divide-green-300/20">
        {records.map((record, index) => (
          <tr key={index} className="hover:bg-white/10 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              {record.fileName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-900/50 text-emerald-300">
                {record.fileType}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableView;