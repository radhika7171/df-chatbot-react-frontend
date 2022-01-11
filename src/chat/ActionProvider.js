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
      .then((res) => {
        const response = res.data[0];
        response?.forEach((message) => {
          console.log("message => ", message);

          // Message is text
          if (message?.message === "text") {
            const messageText = message?.text?.text[0];
            this.createPayloadWidget(messageText);
          } else if (message?.message === "payload") {
            const messagePayloadType =
              message?.payload?.fields?.richContent?.listValue?.values[0]
                ?.listValue?.values[0].structValue?.fields?.type?.stringValue;

            const messagePayload =
              message?.payload?.fields?.richContent?.listValue?.values[0]
                ?.listValue?.values[0].structValue?.fields?.options.listValue
                .values;

            // Message is Button or Chips
            if (
              messagePayloadType === "button" ||
              messagePayloadType === "chips"
            ) {
              this.createPayloadWidget(
                "Please choose one:",
                messagePayload,
                messagePayloadType
              );
            }
          }

          // Message is Chip
          /* if (messagePayloadType === "chips") {
            console.log("chips called!");
            this.createPayloadWidget(messagePayload, messagePayloadType);
          } */
        });
      });
  }

  createPayloadWidget(
    messageText,
    messagePayload = null,
    messagePayloadType = null
  ) {
    const messagePayloadArray = [];
    messagePayload?.forEach((message) => {
      messagePayloadArray.push(message?.structValue?.fields);
    });

    const botMessage = this.createChatBotMessage(messageText, {
      widget: messagePayloadType,
    });

    this.setState((prev) => {
      let stateObject = {
        ...prev,
        messages: [...prev.messages, botMessage],
      };

      if (messagePayloadType === "chips") {
        stateObject.widgetConfig = {
          ...prev.widgetConfig,
          chips: messagePayloadArray,
        };
      } else if (messagePayloadType === "button") {
        stateObject.widgetConfig = {
          ...prev.widgetConfig,
          button: messagePayloadArray,
        };
      }

      return stateObject;
    });
  }

  createTextMessage(messageText) {
    const botMessage = this.createChatBotMessage(messageText);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }
}

export default ActionProvider;
