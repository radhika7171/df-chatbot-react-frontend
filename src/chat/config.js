import { createChatBotMessage } from "react-chatbot-kit";
import Chips from "./components/Chips";
import Buttons from "./components/Buttons";

const config = {
  botName: "Arty Bot",
  initialMessages: [createChatBotMessage(`Hello, how are you`)],
  state: {
    widgetConfig: {},
  },
  widgets: [
    {
      widgetName: "chips",
      widgetFunc: (props) => <Chips {...props} />,
      mapStateToProps: ["widgetConfig"],
    },
    {
      widgetName: "buttons",
      widgetFunc: (props) => <Buttons {...props} />,
      mapStateToProps: ["widgetConfig"],
    },
  ],
};
export default config;
