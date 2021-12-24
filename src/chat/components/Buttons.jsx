import React from "react";
import "./Chips.css";
import "./Buttons.css";

const Buttons = (props) => {
  const { buttons } = props.widgetConfig;
  let savedOption = null;
  console.log("button=>", buttons);

  return (
    <div className="button-comp">
      {buttons?.map((opt, index) => (
        <button
          className="button"
          key={index}
          onClick={() => {
            savedOption = opt.text.stringValue;
          }}
        >
          {opt.text.stringValue.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
