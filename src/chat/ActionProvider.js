import axios from "axios";
import { sessionId } from "../session";

class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createClientMessage = createCustomMessage;
  }

  fetcheduserDataFromNode(message) {
    axios
      .get("http://localhost:3333/intelApi", {
        params: {
          message,
          sessionId,
        },
      })
      .then((response) => {
        for (const element of response.data[0]?.queryResult?.responseMessages) {
          let text = null;
          let payload = null;
          let options = [];

          // Condition when the response message type is "text"
          if (element?.message === "text") {
            text = element?.text?.text[0];
            const botMessage = this.createChatBotMessage(text);
            this.setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
            }));
          }

          // Condition when the response message type is "payload"
          if (element?.message === "payload") {
            payload =
              element?.payload?.fields?.richContent?.listValue?.values[0]
                ?.listValue?.values[0]?.structValue?.fields?.options?.listValue
                ?.values;
            for (const element of payload) {
              const field = element?.structValue?.fields;
              options.push(field);
            }
            const botMessage = this.createChatBotMessage(
              "Please select one of the chip options",
              {
                widget: "chips",
              }
            );
            this.setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
              widgetConfig: { options },
            }));
          }
        }
      });
  }
}

export default ActionProvider;
