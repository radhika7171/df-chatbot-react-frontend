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
          console.log("sessionId=>", sessionId);

          // Condition when the response message type is "text"
          if (element?.message === "text") {
            text = element?.text?.text[0];
          }

          // Condition when the response message type is "payload"
          if (element?.message === "payload") {
            return;
          }

          let botMessage = null;
          botMessage = this.createChatBotMessage(text);
          this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
          }));
        }
      });
  }
}

export default ActionProvider;
