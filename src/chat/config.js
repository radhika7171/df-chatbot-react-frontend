import { createChatBotMessage } from "react-chatbot-kit";
import Chips from "./components/Chips";

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
  ],
};
export default config;
