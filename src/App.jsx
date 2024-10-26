
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello I am GPT",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage]; // all old messages + the new message

    // update our messages state
    setMessages(newMessages);

    // set Typing indicator
    setTyping(true);

    // process message to ChatGPT (send it over and see response)
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages { sender: "user" or "ChatGPT", message:"The message content here"}
    // apiMessages { role: "user" or "assistant", content: "The message content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Speak like a pirate" // Speak like a pirate, Explain like I am 10
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages] // [message1, message2, message3]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ${API_KEY}', // Fix header formatting
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();
      console.log(data);

      setMessages([
        ...chatMessages,
        {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }
      ]);

    } catch (error) {
      console.error("Error fetching data from ChatGPT: ", error);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      <div className="App">
        <div className="" style={{ position: "relative", height: "550px", width: "700px" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior='smooth'
                typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
              >
                {messages.map((message, i) => {
                  return (
                    <Message
                      key={i}
                      model={{
                        message: message.message,
                        sentTime: "just now",
                        sender: message.sender,
                        direction: message.direction === "outgoing" ? "outgoing" : "incoming",
                        position: "normal"
                      }}
                    />
                  )
                })}
              </MessageList>
              <MessageInput placeholder='Type here' onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default App;