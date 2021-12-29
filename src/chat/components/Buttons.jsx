import React from "react";
import "./Chips.css";
import "./Buttons.css";

const Buttons = (props) => {
  const { buttons } = props.widgetConfig;
  let savedOption = null;

  return (
    <div className="button-comp">
      {buttons?.map((option, index) => (
        <button
          className="button"
          key={index}
          onClick={() => {
            savedOption = option.text.stringValue;
          }}
        >
          {option.text.stringValue.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
