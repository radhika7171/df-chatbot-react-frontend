import React from "react";
import "./Chips.css";

const Chips = (props) => {
  const { actionProvider } = props;
  const { options } = props.widgetConfig;
  console.log("options =>", options);

  return (
    <div className="ml-5">
      {options?.map((opt) => (
        <button
          className="chip"
          key={opt.text}
          onClick={() => {
            window.open(opt.link);
            actionProvider.handleMessage(opt.text);
          }}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
};

export default Chips;
