import React from "react";
import { Shield, FileText } from "lucide-react";
import TableView from "./common/TableView";
import AccordionView from "./common/AccordionView";

const RecordsTab = ({ records, groupedRecords, viewType, setViewType }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Shield className="h-5 w-5 mr-2 text-emerald-400" />
        Medical Records
        <span className="ml-3 text-sm font-normal text-green-300 bg-emerald-600/30 px-2 py-1 rounded-full">
          Blockchain Secured
        </span>
      </h2>

      <div className="relative">
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="appearance-none bg-white/10 border border-emerald-300/30 text-white rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="table" className="bg-gray-800 text-white">
            Table View
          </option>
          <option value="type" className="bg-gray-800 text-white">
            Group by Type
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>

    <div className="bg-white/5 rounded-lg p-4">
      {records.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-green-200" />
          <h3 className="mt-2 text-lg font-medium text-white">
            No medical records found
          </h3>
          <p className="mt-1 text-sm text-green-200">
            Your uploaded documents will appear here
          </p>
        </div>
      ) : viewType === "table" ? (
        <TableView records={records} />
      ) : (
        <AccordionView groupedRecords={groupedRecords} />
      )}
    </div>
  </div>
);

export default RecordsTab;