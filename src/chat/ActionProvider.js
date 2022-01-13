import { ContactlessOutlined } from "@material-ui/icons";
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
        console.log("response>>>>>>>", res);
        const response = res.data[0];
        response?.forEach((message) => {
          const messageText = message?.text?.text[0];

          const messagePayloadType =
            message?.payload?.fields?.richContent?.listValue?.values[0]
              ?.listValue?.values[0].structValue?.fields?.type?.stringValue;

          const messagePayload =
            message?.payload?.fields?.richContent?.listValue?.values[0]
              ?.listValue?.values[0].structValue?.fields?.options.listValue
              .values;

          if (
            message?.message === "text" ||
            messagePayloadType === "button" ||
            messagePayloadType === "chips"
          ) {
            this.createResponseTextandPayloadWidget(
              messageText,
              messagePayload,
              messagePayloadType
            );
          }
        });
      });
  }

  createResponseTextandPayloadWidget(
    messageText,
    messagePayload,
    messagePayloadType
  ) {
    const messagePayloadArray = [];
    //@todo: implement multilingual label
    let option = "choose one of the option:";
    if (messageText === undefined) {
      messageText = option;
    }
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
}

export default ActionProvider;
