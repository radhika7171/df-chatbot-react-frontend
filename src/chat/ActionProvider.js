import axios from 'axios';
import config from "./config"


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
        this.createCustomMessage = createCustomMessage;

    }

    handleMessage(message)
    {
        const agentId = 'e57e5965-27df-4d84-8d56-0402aeae2d00'
        const sessionId = 'dfMessenger-9777522'
        const widgetsAvailable = config.widgets.map( (w) => w.widgetName )
        
        axios.post('https://dialogflow.cloud.google.com/v1/cx/locations/northamerica-northeast1/integrations/messenger/webhook/' 
            + agentId + '/sessions/' 
            + sessionId + ':detectIntent',
            {
                "queryInput": {
                    "text": {
                        "text": message
                    },
                    "languageCode": "en"
                }
            },
            {
                transformResponse: (r) => JSON.parse(r.replace(')]}\'\n',''))
            }
        ).then( (response) => {
            
            let text = null
            let widget = null
            let widgetConfig = {}

            for( let index in response.data.queryResult.responseMessages )
            {
                let botResponse = response.data.queryResult.responseMessages[index]
                console.log(botResponse)

                if( typeof botResponse['text'] != 'undefined' )
                    text = botResponse.text.redactedText[0]

                if( typeof botResponse['payload'] != 'undefined' )
                {
                    // Custom Widgets
                    if( typeof botResponse.payload['widget'] != 'undefined' && widgetsAvailable.indexOf(botResponse.payload.widget) !== -1 )
                    {
                        widget = botResponse.payload.widget
                        if( typeof botResponse.payload['widgetConfig'] != 'undefined' )
                            widgetConfig = botResponse.payload.widgetConfig
                    }


                    // Google Rich Content 
                    if( typeof botResponse.payload['richContent'] != 'undefined' )
                    {
                        for( let ri in botResponse.payload['richContent'] )
                        {
                            let richContent = botResponse.payload.richContent[ri]
                            if( typeof richContent[0] != 'undefined' && typeof richContent[0]['type'] != 'undefined' && widgetsAvailable.indexOf(richContent[0]['type']) !== -1 )
                            {
                                widget = richContent[0]['type']
                                widgetConfig = richContent[0]
                                console.log(widget, widgetConfig)
                            }       
                        }
                    }
                }
            }

            let botMessage = null
            if( widget != null )
                botMessage = this.createChatBotMessage(text, {widget: widget})
            else
                botMessage = this.createChatBotMessage(text)

            this.setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                widgetConfig: widgetConfig
            }))
        })
    }
}

export default ActionProvider;