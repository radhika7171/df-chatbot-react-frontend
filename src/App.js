import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "./chat/config";
import MessageParser from "./chat/MessengerParser";
import ActionProvider from "./chat/ActionProvider";
import axios from "axios";

function App() {
  axios.get("http://localhost:3333/test").then((response) => {
    console.log("backend respponse => ", response);
  });

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
