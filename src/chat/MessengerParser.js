class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    console.log("parse message called!");
    this.actionProvider.handleMessage(message);
  }
}

export default MessageParser;
