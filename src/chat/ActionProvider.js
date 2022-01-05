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

  SendReactRequest_and_handleResponse(InputReact) {
    axios
      .get("http://localhost:3333/IntermediateNodeAPI", {
        params: {
          message: InputReact,
          sessionId,
        },
      })
      .then((response) => {
        for (const element of response.data[0]?.queryResult?.responseMessages) {
          let text = null;
          let payload = null;
          let ChipArray = null;
          let ButtonArray = [];
          let buttons = [];
          let Chips = [];

          // Condition when the response message type is "text"
          if (element?.message === "text") {
            console.log("message block==>");
            text = element?.text?.text[0];
            this.TextResponse(text);
          }
          // Condition when the response message type is "payload"
          if (element?.message === "payload") {
            payload =
              element?.payload?.fields?.richContent?.listValue?.values[0]
                ?.listValue?.values[0].structValue?.fields;
            // payload buttons block
            if (payload?.type?.stringValue === "button") {
              ButtonArray = [payload];

              for (const element of ButtonArray) {
                const options = element?.options?.listValue?.values;

                for (const element of options) {
                  const fields = element?.structValue?.fields;
                  buttons.push(fields);
                }
                this.ButtonPayloadResponse(buttons);
              }
            }

            // Payload chips block
            if (payload?.type?.stringValue === "chips") {
              ChipArray = payload?.options?.listValue?.values;
              for (const element of ChipArray) {
                const field = element?.structValue?.fields;
                Chips.push(field);
              }
              this.ChipPayloadResponse(Chips);
            }
          }
        }
      });
  }

  TextResponse(text) {
    const botMessage = this.createChatBotMessage(text);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  ButtonPayloadResponse(buttons) {
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

  ChipPayloadResponse(Chips) {
    const botMessage = this.createChatBotMessage(
      "Please select one of the chip options",
      {
        widget: "chips",
      }
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      widgetConfig: { Chips },
    }));
  }
}

export default ActionProvider;

// console to check node response and parameters

// console.log(
//   "resonse parameters Node",
//   response.data[0].queryResult.parameters.fields
// );
// console.log(
//   "resonse Message Node",
//   response.data[0].queryResult.responseMessages
// );
