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
          let ObjbuttonPayload = null;
          let buttonPayload = [];
          let buttons = [];
          let options = [];
          console.log("resonse from DF", response.data[0].queryResult);

          // Condition when the response message type is "text"
          if (element?.message === "text") {
            console.log("message block==>");
            text = element?.text?.text[0];
            const botMessage = this.createChatBotMessage(text);
            this.setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
            }));
          }
          // Condition when the response message type is "payload"

          // payload buttons block

          if (element?.message === "payload") {
            console.log("payload block==>");
            if (
              element?.payload?.fields?.richContent?.listValue?.values[0]
                ?.listValue?.values[0].structValue?.fields?.type.stringValue ===
              "button"
            ) {
              console.log("seprate button block==>");
              ObjbuttonPayload =
                element?.payload?.fields?.richContent?.listValue?.values[0]
                  .listValue?.values[0]?.structValue?.fields;

              //  object button saved in array
              buttonPayload = [ObjbuttonPayload];

              for (const element of buttonPayload) {
                const options = element?.options?.listValue?.values;

                for (const element of options) {
                  const fields = element?.structValue?.fields;
                  buttons.push(fields);
                }
                const payloadType = element.type;
                console.log("payloadType==>", payloadType);
                console.log("buttons ===>", buttons);
              }
              const botMessage = this.createChatBotMessage(
                "Choose type of beat license you have !",
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

            // Payload chips block

            if (
              element?.payload?.fields?.richContent?.listValue?.values[0]
                ?.listValue?.values[0]?.structValue?.fields?.type
                ?.stringValue === "chips"
            ) {
              console.log("seprate chips block==>");
              payload =
                element?.payload?.fields?.richContent?.listValue?.values[0]
                  ?.listValue?.values[0]?.structValue?.fields?.options
                  ?.listValue?.values;
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
        }
      });
  }
}

export default ActionProvider;
