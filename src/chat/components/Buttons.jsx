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
        <div key={index}>
          <button
            className="button"
            onClick={() => {
              message = option.text.stringValue;
              props.actionProvider.handleMessage(message);
            }}
          >
            {option.text.stringValue.toUpperCase()}
          </button>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Buttons;
