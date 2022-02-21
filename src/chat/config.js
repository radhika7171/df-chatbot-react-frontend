import { createChatBotMessage } from "react-chatbot-kit";
import Chips from "./components/Chips";
import Buttons from "./components/Buttons";
import React from "react";
import InlineDatePicker from "./components/Datepicker";
import AutocompleteList from "./components/Autosuggest";

const config = {
  botName: "Arty Bot",
  initialMessages: [createChatBotMessage(`Hello, how are you`)],
  state: {
    widgetConfig: {},
  },
  widgets: [
    {
      widgetName: "autosuggest",
      widgetFunc: (props) => <AutocompleteList {...props} />,
      mapStateToProps: ["widgetConfig"],
    },
    {
      widgetName: "chips",
      widgetFunc: (props) => <Chips {...props} />,
      mapStateToProps: ["widgetConfig"],
    },
    {
      widgetName: "button",
      widgetFunc: (props) => <Buttons {...props} />,
      mapStateToProps: ["widgetConfig"],
    },
    {
      widgetName: "datepicker",
      widgetFunc: (props) => <InlineDatePicker {...props} />,
      mapStateToProps: ["widgetConfig"],
    },
  ],
};
export default config;
