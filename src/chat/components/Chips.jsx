import React from "react";
import "./Chips.css";

const Chips = (props) => {
  const { chips } = props.widgetConfig;

  return (
    <div className="ml-5">
      {chips?.map((opt, index) => (
        <button
          className="chip"
          key={index}
          onClick={() => {
            window.open(opt.link.stringValue);
          }}
        >
          {opt.text.stringValue.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default Chips;
