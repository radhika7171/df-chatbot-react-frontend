import React from "react";
import axios from "axios";
import "./Chips.css";
import "./Buttons.css";

const Buttons = (props) => {
  const { buttons } = props.widgetConfig;
  let message = null;

  return (
    <div className="button-comp">
      {buttons?.map((option, index) => (
        <button
          className="button"
          key={index}
          onClick={() => {
            message = option.text.stringValue;
            props.actionProvider.SendReactRequest_and_handleResponse(message);
          }}
        >
          {option.text.stringValue.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
