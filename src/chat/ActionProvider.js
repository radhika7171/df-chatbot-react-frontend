import axios from "axios";
import config from "./config";

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

  handleMessage(message) {
    console.log("handle message reached!", message);
    const agentId = "a9ef8e65-f0b1-4d1c-8163-975328ee8e80";
    const sessionId = "dfMessenger-9777522";
    const widgetsAvailable = config.widgets.map((w) => w.widgetName);
    axios.get("http://localhost:3333/intelApi").then((response) => {
      console.log("response from get demo api => ", response);
      const user = response.data.user;
      const contract = response.data.contracts.template_39;
      console.log("userInfo==>", user);
      console.log("ContractInfo==>", contract);
    });

    axios
      .post(
        "https://dialogflow.cloud.google.com/v1/cx/locations/us-central1/integrations/messenger/webhook/" +
          agentId +
          "/sessions/" +
          sessionId +
          ":detectIntent",
        {
          queryInput: {
            text: {
              text: message,
            },
            languageCode: "en",
          },
        },
        {
          transformResponse: (r) => JSON.parse(r.replace(")]}'\n", "")),
        }
      )
      .then(
        (response) => {
          console.log("agentID==>", agentId);
          console.log("sessionID==>", sessionId);

          console.log(
            "response from action provider handle message => ",
            response
          );
          let text = null;
          let widget = null;
          let widgetConfig = {};

          for (let index in response.data.queryResult.responseMessages) {
            let botResponseMessage =
              response.data.queryResult.responseMessages[index];
            console.log(botResponseMessage);
            if (typeof botResponseMessage["text"] != "undefined")
              text = botResponseMessage.text.redactedText[0];

            if (typeof botResponseMessage["payload"] != "undefined") {
              // Custom Widgets
              if (
                typeof botResponseMessage.payload["widget"] != "undefined" &&
                widgetsAvailable.indexOf(botResponseMessage.payload.widget) !==
                  -1
              ) {
                widget = botResponseMessage.payload.widget;
                if (
                  typeof botResponseMessage.payload["widgetConfig"] !=
                  "undefined"
                )
                  widgetConfig = botResponseMessage.payload.widgetConfig;
              }

              // Google Rich Content
              if (
                typeof botResponseMessage.payload["richContent"] != "undefined"
              ) {
                for (let ri in botResponseMessage.payload["richContent"]) {
                  let richContent = botResponseMessage.payload.richContent[ri];
                  if (
                    typeof richContent[0] != "undefined" &&
                    typeof richContent[0]["type"] != "undefined" &&
                    widgetsAvailable.indexOf(richContent[0]["type"]) !== -1
                  ) {
                    widget = richContent[0]["type"];
                    widgetConfig = richContent[0];
                    console.log(widget, widgetConfig);
                  }
                }
              }
            }
          }

          let botMessage = null;
          if (widget != null)
            botMessage = this.createChatBotMessage(text, { widget: widget });
          else botMessage = this.createChatBotMessage(text);

          this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
            widgetConfig: widgetConfig,
          }));
        },
        (error) => {
          console.log("some error occurred => ", error);
        }
      );
  }
}

export default ActionProvider;
