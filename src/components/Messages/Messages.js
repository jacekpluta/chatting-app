import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import TypingLoader from "./TypingLoader";

import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";

import { connect } from "react-redux";
import { setUserPosts, setCurrentChannel } from "../../actions";

import Message from "./Message";
const Messages = props => {
  const [channelsRef] = useState(firebase.database().ref("channels"));

  const [messageImageLoading, setMessageImageLoading] = useState(false);
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [usersRef] = useState(firebase.database().ref("users"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [allChannelMessages, setAllChannelMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const [channelStarred, setChannelStarred] = useState(false);

  const {
    currentChannel,
    currentUser,
    isPrivateChannel,
    setMessagesFull,
    setMessagesEmpty,
    userTyping
  } = props;

  const setMessageImageLoadingTrue = () => {
    setMessageImageLoading(true);
  };

  const setMessageImageLoadingFalse = () => {
    setMessageImageLoading(false);
  };

  useEffect(() => {
    if (currentChannel && currentUser) {
      addUserStarsListeners(currentChannel.id, currentUser.uid);
      addListeners();
      loadData();
    }
  }, []);

  useEffect(() => {
    if (messagesLoaded) {
      countUserPosts();
      setMessagesFull();
    } else {
      setMessagesEmpty();
    }
  }, [messagesLoaded]);

  const addListeners = () => {
    addMessageListeners();
  };

  useEffect(() => {
    if (messagesLoaded) {
      if (currentChannel.createdBy.uid === currentUser.uid) {
        const newCurrentChannelInfo = {
          id: currentChannel.id,
          name: currentChannel.name,
          details: currentChannel.details,
          createdBy: {
            uid: currentChannel.createdBy.uid,
            name: currentChannel.createdBy.name,
            avatar: currentUser.photoURL
          }
        };

        channelsRef.child(currentChannel.id).update(newCurrentChannelInfo);
        props.setCurrentChannel(newCurrentChannelInfo);
      }
    }
  }, [messagesLoaded]);

  const unstarChannel = () => {
    usersRef
      .child(`${currentUser.uid}/starred`)
      .child(currentChannel.id)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      });
    setChannelStarred(false);
  };

  useEffect(() => {
    if (channelStarred) {
      usersRef.child(`${currentUser.uid}/starred`).update({
        [currentChannel.id]: {
          name: currentChannel.name,
          details: currentChannel.details,
          createdBy: {
            uid: currentChannel.createdBy.uid,
            name: currentChannel.createdBy.name,
            avatar: currentChannel.createdBy.avatar
          }
        }
      });
    }
  }, [channelStarred]);

  const handleStarred = () => {
    setChannelStarred(true);
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
          const prevStarred = channelIds.includes(currentChannel.id);
          setChannelStarred(prevStarred);
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
    let loadedMessages = [];
    const ref = getMessagesRef();

    ref.child(currentChannel.id).on("child_added", snapshot => {
      loadedMessages.push(snapshot.val());
      setAllChannelMessages({ loadedMessages });
    });
  };

  const loadData = () => {
    messagesRef
      .child(currentChannel.id)
      .once("value", snapshot => {})
      .then(snapshot => {
        setMessagesLoaded(true);
      });
  };

  const countUserPosts = () => {
    if (allChannelMessages.loadedMessages) {
      let userPosts = allChannelMessages.loadedMessages.reduce(
        (acc, message) => {
          if (message.currentUser.name in acc) {
            acc[message.currentUser.name].count += 1;
          } else {
            acc[message.currentUser.name] = {
              avatar: message.currentUser.avatar,
              count: 1
            };
          }
          return acc;
        },
        {}
      );
      props.setUserPosts(userPosts);
    } else {
      props.setUserPosts(null);
    }
  };

  return (
    <React.Fragment>
      <MessagesHeader
        unstarChannel={unstarChannel}
        handleSearchChange={handleSearchChange}
        displayChannelName={displayChannelName}
        searchLoading={searchLoading}
        isPrivateChannel={isPrivateChannel}
        handleStarred={handleStarred}
        channelStarred={channelStarred}
      ></MessagesHeader>
      <Segment>
        <Loader
          active={!messagesLoaded}
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
              }) &&
              <div> {userTyping.userTypingName}</div> && (
                <TypingLoader userTyping={userTyping}></TypingLoader>
              )
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
};

export default connect(null, { setUserPosts, setCurrentChannel })(Messages);
