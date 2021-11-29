import Chips from "./components/Chips";

const config = {
  botName: "Arty Bot",
  initialMessages: [], //[createChatBotMessage(`Hello world`)],
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
