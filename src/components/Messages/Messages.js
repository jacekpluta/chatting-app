import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";

import Message from "./Message";

export default function Messages(props) {
  const [messageImageLoading, setMessageImageLoading] = useState(false);
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [allChannelMessages, setAllChannelMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const { currentChannel, currentUser, isPrivateChannel } = props;

  const setMessageImageLoadingTrue = () => {
    setMessageImageLoading(true);
  };

  const setMessageImageLoadingFalse = () => {
    setMessageImageLoading(false);
  };

  useEffect(() => {
    if (currentChannel && currentUser) {
      addListeners();
    }

    return () => {};
  }, []);

  const addListeners = () => {
    addMessageListeners();
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
  };

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchMessages();
    } else {
    }
  }, [searchTerm]);

  const handleSearchMessages = () => {
    const channelMessages = [...allChannelMessages.loadedMessages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.currentUser.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    setSearchResult(searchResults);
    setTimeout(() => {
      setSearchLoading(false);
    }, 1000);
  };

  const displayChannelName = () => {
    if (currentChannel && !isPrivateChannel) {
      return `#${currentChannel.name}`;
    } else if (currentChannel && isPrivateChannel) {
      return `@${currentChannel.name}`;
    } else {
      return "";
    }
  };

  const addMessageListeners = () => {
    let myFirstPromise = new Promise((resolve, reject) => {
      let loadedMessages = [];
      const ref = getMessagesRef();

      resolve(
        ref.child(currentChannel.id).on("child_added", snapshot => {
          loadedMessages.push(snapshot.val());
          setAllChannelMessages({ loadedMessages });
        })
      );
    });

    myFirstPromise.then(successMessage => {
      setMessagesLoading(false);
    });
  };

  return (
    <React.Fragment>
      <MessagesHeader
        handleSearchChange={handleSearchChange}
        displayChannelName={displayChannelName}
        searchLoading={searchLoading}
        isPrivateChannel={isPrivateChannel}
      ></MessagesHeader>
      <Segment>
        <Loader
          active={messagesLoading}
          size="huge"
          content="Loading Messages"
        ></Loader>
        <Comment.Group className="messages">
          {allChannelMessages.loadedMessages && searchTerm === ""
            ? allChannelMessages.loadedMessages.map(message => {
                return (
                  <Message
                    key={message.timeStamp}
                    message={message}
                    currentUser={currentUser}
                    messageImageLoading={messageImageLoading}
                    searchResult={searchResult}
                    searchTerm={searchTerm}
                  />
                );
              })
            : ""}

          {allChannelMessages.loadedMessages && searchTerm
            ? searchResult.map(message => {
                return (
                  <Message
                    key={message.timeStamp}
                    message={message}
                    currentUser={currentUser}
                    messageImageLoading={messageImageLoading}
                    searchResult={searchResult}
                    searchTerm={searchTerm}
                  />
                );
              })
            : ""}
        </Comment.Group>
      </Segment>
      <MessagesForm
        setMessageImageLoadingTrue={setMessageImageLoadingTrue}
        setMessageImageLoadingFalse={setMessageImageLoadingFalse}
        messagesRef={messagesRef}
        currentChannel={currentChannel}
        currentUser={currentUser}
        messageImageLoading={messageImageLoading}
        getMessagesRef={getMessagesRef}
      ></MessagesForm>
    </React.Fragment>
  );
}
