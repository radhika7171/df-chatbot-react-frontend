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
    console.log("apiCalled==>");
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
          let ObjbuttonPayload = null;
          let buttonPayload = [];
          let buttons = [];
          let options = [];
          console.log("resonse from DF", response);

          // Condition when the response message type is "text"
          if (element?.message === "text") {
            console.log("message received");
            text = element?.text?.text[0];
            const botMessage = this.createChatBotMessage(text);
            this.setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
            }));
          }
          // Condition when the response message type is "payload"
          //button
          if (
            element?.payload?.fields?.richContent?.listValue?.values[0]
              .structValue?.fields?.type.stringValue === "button"
          ) {
            console.log("payloadbutton");
            ObjbuttonPayload =
              element?.payload?.fields?.richContent?.listValue?.values[0]
                .structValue?.fields;
            //  object button saved in array
            buttonPayload = [ObjbuttonPayload];
            for (const element of buttonPayload) {
              buttons.push(element);
            }
            const botMessage = this.createChatBotMessage(
              "Please select one of the button options",
              {
                widget: "buttons",
              }
            );
            this.setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
              widgetConfig: { buttons },
            }));
          }

          //chips
        }
      });
  }
}

export default ActionProvider;
