import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "./chat/config";
import MessageParser from "./chat/MessengerParser";
import ActionProvider from "./chat/ActionProvider";

function App() {
  return (
    <div className="App">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}

export default App;
