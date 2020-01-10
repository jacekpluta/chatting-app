import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState, useEffect, useRef } from "react";
import { Loader } from "semantic-ui-react";

import Message from "./Message";

export default function Messages(props) {
  const [messageImageLoading, setMessageImageLoading] = useState(false);
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [usersRef] = useState(firebase.database().ref("users"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [allChannelMessages, setAllChannelMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isChannelStarred, setIsChannelStarred] = useState(false);

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
      addUserStarsListeners(currentChannel.id, currentUser.uid);
    }

    return () => {};
  }, []);

  const addListeners = () => {
    addMessageListeners();
  };

  useEffect(() => {
    if (isChannelStarred) {
      usersRef.child(`${currentUser.uid}/starred`).update({
        [currentChannel.id]: {
          name: currentChannel.name,
          details: currentChannel.details,
          createdBy: {
            name: currentChannel.createdBy.name,
            avatar: currentChannel.createdBy.avatar
          }
        }
      });
    } else {
      usersRef.child(`${currentUser.uid}/starred`).remove(err => {
        if (err !== null) {
          console.log(err);
        }
      });
    }
  }, [isChannelStarred]);

  const handleStarred = () => {
    setIsChannelStarred(!isChannelStarred);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
  };

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  const addUserStarsListeners = (channelId, userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          setIsChannelStarred(prevStarred);
        }
      });
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchMessages();
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
        handleStarred={handleStarred}
        isChannelStarred={isChannelStarred}
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
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
