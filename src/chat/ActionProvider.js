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

  handleMessage(inputMessageString) {
    axios
      .get("http://localhost:3333/IntermediateNodeAPI", {
        params: {
          message: inputMessageString,
          sessionId,
        },
      })
      .then((response) => {
        response.data[0]?.queryResult?.responseMessages.forEach(
          (responseMessage) => {
            const messageType = responseMessage?.message;
            // Condition when the response message type is "text"
            if (messageType === "text") {
              const text = responseMessage?.text?.text[0];
              this.createTextMessage(text);
            }
            // Condition when the response message type is "payload"
            if (messageType === "payload") {
              const payload =
                responseMessage?.payload?.fields?.richContent?.listValue
                  ?.values[0]?.listValue?.values[0].structValue?.fields;

              // payload buttons block
              if (payload?.type?.stringValue === "button") {
                const buttonsArray = [payload];
                this.createButtonWidget(buttonsArray);
              }

              // Payload chips block
              if (payload?.type?.stringValue === "chips") {
                const chipsArray = payload?.options?.listValue?.values;
                this.createChipWidget(chipsArray);
              }
            }
          }
        );
      });
  }

  createTextMessage(text) {
    const botMessage = this.createChatBotMessage(text);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  createButtonWidget(buttonsArray) {
    let buttons = [];
    buttonsArray.forEach((button) => {
      const options = button?.options?.listValue?.values;
      options.forEach((option) => {
        const fields = option?.structValue?.fields;
        buttons.push(fields);
      });
      const botMessage = this.createChatBotMessage(
        "Please select one of the chip options !",
        {
          widget: "buttons",
        }
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        widgetConfig: { buttons },
      }));
    });
  }

  createChipWidget(chipsArray) {
    const chipsWidgetArray = [];
    chipsArray.forEach((chips) =>
      chipsWidgetArray.push(chips?.structValue?.fields)
    );
    const botMessage = this.createChatBotMessage(
      "Please select one of the chip options",
      {
        widget: "chips",
      }
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      widgetConfig: { chips: chipsWidgetArray },
    }));
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
