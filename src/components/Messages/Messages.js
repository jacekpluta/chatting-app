import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState, useEffect } from "react";

import Message from "./Message";

export default function Messages(props) {
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const { currentChannel, currentUser } = props;
  const [allChannelMessages, setAllChannelMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    if (currentChannel && currentUser) {
      addListeners();
    }
    return () => {};
  }, []);

  const addListeners = () => {
    addMessageListeners();
  };

  const addMessageListeners = () => {
    let loadedMessages = [];
    messagesRef.child(currentChannel.id).on("child_added", snapshot => {
      loadedMessages.push(snapshot.val());

      setAllChannelMessages({ loadedMessages });
      setMessagesLoading(false);
    });
  };

  return (
    <React.Fragment>
      <MessagesHeader></MessagesHeader>
      <Segment>
        <Comment.Group className="messages">
          {allChannelMessages.loadedMessages
            ? allChannelMessages.loadedMessages.map(message => {
                return (
                  <Message
                    key={message.timeStamp}
                    message={message}
                    currentUser={currentUser}
                  />
                );
              })
            : ""}
        </Comment.Group>
      </Segment>
      <MessagesForm
        messagesRef={messagesRef}
        currentChannel={currentChannel}
        currentUser={currentUser}
      ></MessagesForm>
    </React.Fragment>
  );
}
