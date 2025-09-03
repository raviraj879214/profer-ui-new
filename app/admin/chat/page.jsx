"use client";
import React, { useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ConversationHeader,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const ChatBox = () => {
  const [chats, setChats] = useState({
    Joe: [
      {
        message: "Hello my friend",
        sentTime: "just now",
        sender: "Joe",
        direction: "incoming",
      },
    ],
    Anna: [
      {
        message: "Hi there! How are you?",
        sentTime: "yesterday",
        sender: "Anna",
        direction: "incoming",
      },
    ],
    Mike: [],
  });

  const [activeUser, setActiveUser] = useState("Joe");

  const users = [
    { id: 1, name: "Joe", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Anna", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Mike", avatar: "https://i.pravatar.cc/150?img=3" },
  ];

  const handleSend = (msg) => {
    const newMessage = {
      message: msg,
      sentTime: new Date().toLocaleTimeString(),
      sender: "Me",
      direction: "outgoing",
    };

    setChats((prev) => ({
      ...prev,
      [activeUser]: [...prev[activeUser], newMessage],
    }));
  };

  return (
    <div
      style={{
        position: "relative",
        height: "600px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <MainContainer responsive>
        {/* Sidebar with user list */}
        <Sidebar
          position="left"
          scrollable
          style={{ borderRight: "1px solid #e5e7eb", background: "#fafafa" }}
        >
          <ConversationList>
            {users.map((user) => {
              const lastMessage =
                chats[user.name][chats[user.name].length - 1]?.message ||
                "No messages yet";
              return (
                <Conversation
                  key={user.id}
                  name={user.name}
                  info={lastMessage}
                  active={activeUser === user.name}
                  onClick={() => setActiveUser(user.name)}
                >
                  <Avatar src={user.avatar} name={user.name} status="available" />
                </Conversation>
              );
            })}
          </ConversationList>
        </Sidebar>

        {/* Chat Area */}
        <ChatContainer>
          {/* Header */}
          <ConversationHeader>
            <Avatar
              src={users.find((u) => u.name === activeUser)?.avatar}
              name={activeUser}
            />
            <ConversationHeader.Content
              userName={activeUser}
              info="Online"
            />
          </ConversationHeader>

          {/* Messages */}
          <MessageList typingIndicator={<TypingIndicator content="Typing..." />}>
            {chats[activeUser].map((msg, idx) => (
              <Message
                key={idx}
                model={{
                  ...msg,
                  style: {
                    backgroundColor:
                      msg.direction === "outgoing" ? "#DCF8C6" : "#FFF",
                    borderRadius: "12px",
                    padding: "6px 12px",
                  },
                }}
              />
            ))}
          </MessageList>

          {/* Input */}
          <MessageInput
            placeholder={`Message ${activeUser}...`}
            onSend={handleSend}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatBox;
