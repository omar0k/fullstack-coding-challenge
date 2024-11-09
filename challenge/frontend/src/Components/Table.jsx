import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";
const Table = ({ complaints, title, loading }) => {
  const headers = complaints.length > 0 ? Object.keys(complaints[0]) : [];
  const [sortBy, setSortBy] = useState("unique_key");
  const sortedData = [...complaints].sort((a, b) => {
    const valA = a[sortBy] || null;
    const valB = b[sortBy] || null;

    if ((valA === null || valA === "") && (valB === null || valB === ""))
      return 0;
    if (valA === null || valA === " ") return 1;
    if (valB === null || valB === " ") return -1;

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
  return (
    <table className="table-auto border-collapse w-full">
      <caption className="font-bold text-lg mb-5">{title}</caption>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              onClick={() => setSortBy(header)}
              className="border hover:bg-blue-500 hover:cursor-pointer bg-blue-400 p-2 border-black"
            >
              <span className="flex justify-center items-center gap-2">
                {header} <ArrowUpDown size={15} />
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={headers.length} className="text-center p-4">
              Loading...
            </td>
          </tr>
        ) : (
          sortedData.map((item) => (
            <tr key={item.id}>
              {headers.map((header) => (
                <td className="border border-black p-2">{item[header]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
