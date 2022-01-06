class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  // This message string is coming from React-chat-bot kit.
  parse(inputMessageString) {
    this.actionProvider.handleMessage(inputMessageString);
  }
}

export default MessageParser;
