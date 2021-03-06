import React from "react";
import "./Chips.css";

const Chips = (props) => {
  const { chips } = props.widgetConfig;
  const widgetPayloadArray = chips;
  return (
    <div className="ml-5">
      {widgetPayloadArray?.map((opt, index) => (
        <button
          className="chip"
          key={index}
          onClick={() => {
            props.actionProvider.handleMessage(opt.text.stringValue);
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
