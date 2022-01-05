class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(InputReact) {
    // this.actionProvider.handleMessage(message);
    this.actionProvider.SendReactRequest_and_handleResponse(InputReact);
  }
}

export default MessageParser;
