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
        console.log("response>>>>>>", response);

        response?.forEach((message) => {
          const messagePayloadType =
            message?.payload?.fields?.richContent?.listValue?.values[0]
              ?.listValue?.values[0].structValue?.fields?.type?.stringValue;
          const messagePayload =
            message?.payload?.fields?.richContent?.listValue?.values[0]
              ?.listValue?.values[0].structValue?.fields?.options.listValue
              .values;

          // Message is text
          if (message?.message === "text") {
            const messageText = message?.text?.text[0];
            this.createTextMessage(messageText);
          }
          // Message is Button
          if (messagePayloadType === "button") {
            this.createPayloadWidget(messagePayload, messagePayloadType);
          }

          // Message is Chip
          if (messagePayloadType === "chips") {
            this.createPayloadWidget(messagePayload, messagePayloadType);
          }
        });
      });
  }

  createPayloadWidget(messagePayload, messagePayloadType) {
    console.log("payload>>>>");
    const messagePayloadArray = [];
    messagePayload.forEach((message) => {
      messagePayloadArray.push(message?.structValue?.fields);
    });
    const botMessage = this.createChatBotMessage("", {
      widget: messagePayloadType,
    });
    console.log("messagePayload>>>>", botMessage.widget);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      widgetConfig: { widgetPayloadArray: messagePayloadArray },
    }));
  }

  createTextMessage(messageText) {
    console.log("text function block called>>>>>");
    const botMessage = this.createChatBotMessage(messageText);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }
}

export default ActionProvider;
