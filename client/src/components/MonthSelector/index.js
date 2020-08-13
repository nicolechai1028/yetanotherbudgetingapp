import React from "react";
import ArrowRight from "../../icons/ArrowRight";
import ArrowLeft from "../../icons/ArrowLeft";
function MonthSelector(props) {
  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "40px" }}>
        <ArrowLeft />
      </div>
      <div style={{ width: "40px" }}>
        <ArrowRight />
      </div>
    </div>
  );
}

export default MonthSelector;
