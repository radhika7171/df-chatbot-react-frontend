import React from "react";
import axios from "axios";
import "./Chips.css";
import "./Buttons.css";

const Buttons = (props) => {
  const { button } = props.widgetConfig;
  const widgetPayloadArray = button;

  return (
    <div className="button-comp">
      {widgetPayloadArray?.map((option, index) => (
        <div key={index}>
          <button
            className="button"
            onClick={() => {
              // message = option.text.stringValue;
              props.actionProvider.handleMessage(option.text.stringValue);
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
