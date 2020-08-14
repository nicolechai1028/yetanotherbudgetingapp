import React, { useState, useEffect } from "react";
import ArrowRight from "../../icons/ArrowRight";
import ArrowLeft from "../../icons/ArrowLeft";
import { useParams } from "react-router";

function MonthSelector(props) {
  const [year, setYear] = useState(parseInt(props.yearMonth.substring(0, 4)));
  const [month, setMonth] = useState(parseInt(props.yearMonth.substring(4, 6)));
  const update = (number) => {
    if (month === 12 && number > 0) {
      setYear(year + 1);
    }
    if (month === 1 && number < 0) {
      setYear(year - 1);
    }
    setMonth(month + number);
  };
  useEffect(() => {
    const yearMonth = toString(year, month);
    if (yearMonth !== props.yearMonth) {
      props.setYearMonth(yearMonth);
    }
  }, [month, props, props.yearMonth, year]);

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "40px" }} onClick={() => update(-1)}>
        <ArrowLeft />
      </div>
      <div>
        {monthToString(month)} {year}
      </div>
      <div style={{ width: "40px" }} onClick={() => update(1)}>
        <ArrowRight />
      </div>
    </div>
  );
}
const toString = (year, month) => {
  return month < 10 ? `${year}0${month}` : `${year}${month}`;
};
const monthToString = (num) => {
  switch (num) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    default:
      return "Error";
  }
};

export default MonthSelector;
