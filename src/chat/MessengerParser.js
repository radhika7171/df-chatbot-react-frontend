class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    // this.actionProvider.handleMessage(message);
    console.log("msg parser");
    this.actionProvider.fetcheduserDataFromNode(message);
  }
}

export default MessageParser;
