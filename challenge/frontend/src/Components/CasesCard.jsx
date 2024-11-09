import React from "react";

const CasesCard = ({ title, content }) => {
  return (
    <div className="  text-lg border font-semibold bg-blue-500 rounded-md p-3">
      {title}: {content}
    </div>
  );
};

export default CasesCard;
