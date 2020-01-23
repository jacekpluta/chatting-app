import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import TypingLoader from "./TypingLoader";

import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState, useEffect, useRef } from "react";

import { connect } from "react-redux";
import { setUserPosts, setCurrentChannel } from "../../actions";
import SkeletonMessages from "./SkeletonMessages";

import Message from "./Message";
const Messages = props => {
  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [usersRef] = useState(firebase.database().ref("users"));

  const messagesEndRef = useRef(null);

  const [friendsList, setFriendsList] = useState([]);
  const [messageImageLoading, setMessageImageLoading] = useState(false);
  const [allChannelMessages, setAllChannelMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [channelStarred, setChannelStarred] = useState(false);
  const [noMessages, setNoMessages] = useState(false);
  const [friendAdded, setFriendAdded] = useState(false);

  const {
    currentChannel,
    currentUser,
    isPrivateChannel,
    userTyping,
    usersList
  } = props;

  const setMessageImageLoadingTrue = () => {
    setMessageImageLoading(true);
  };

  const setMessageImageLoadingFalse = () => {
    setMessageImageLoading(false);
  };

  //RUNS AND REMOVES LISTENERS
  useEffect(() => {
    if (currentChannel && currentUser) {
      addListeners();

      return () => {
        const ref = getMessagesRef();
        ref.child(currentChannel.id).off("child_added");
        messagesRef.off();
      };
    }
  }, []);

  //COUNTS ALL USER POSTS IN CURRENT CHANNEL
  useEffect(() => {
    if (messagesLoaded) {
      countUserPosts();
    }
  }, [messagesLoaded]);

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

  //LISTENERS
  const addListeners = () => {
    addMessageListeners();
    loadData();
    addUserStarsListeners(currentChannel.id, currentUser.uid);
    addUserFriendsListeners(currentChannel.id, currentUser.uid);
  };

  //UPDATES CURRENT CHANNEL INFO
  useEffect(() => {
    if (messagesLoaded && !isPrivateChannel) {
      if (currentChannel.createdBy.uid === currentUser.uid) {
        const newCurrentChannelInfo = {
          createdBy: {
            avatar: currentUser.photoURL,
            name: currentChannel.createdBy.name,
            uid: currentChannel.createdBy.uid
          },
          details: currentChannel.details,
          id: currentChannel.id,
          name: currentChannel.name
        };

        channelsRef.child(currentChannel.id).update(newCurrentChannelInfo);
        props.setCurrentChannel(newCurrentChannelInfo);
      }
    }
  }, [messagesLoaded]);

  //ADD STARRED CHANNEL
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

  //REMOVE STARRED CHANNEL
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

  //LISTEN FOR STARRED CHANNELS
  const addUserStarsListeners = (channelId, userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          setChannelStarred(prevStarred);
        }
      });
  };

  //ADD FRIEND
  useEffect(() => {
    if (friendAdded) {
      let selectPrivateChannel = currentChannel.id.replace(currentUser.uid, "");
      let privateChannel = selectPrivateChannel.replace("/", "");

      usersRef.child(`${currentUser.uid}/friends`).update({
        [privateChannel]: {
          channelId: currentChannel.id,
          name: currentChannel.name,
          status: currentChannel.status,
          photoURL: currentChannel.photoURL
        }
      });
    }
  }, [friendAdded]);

  const handleAddFriend = () => {
    setFriendAdded(true);
  };

  //REMOVE FRIEND
  const unfriendPerson = () => {
    let mystring = currentChannel.id.replace(currentUser.uid, "");
    let privateChannel = mystring.replace("/", "");
    usersRef
      .child(`${currentUser.uid}/friends`)
      .child(privateChannel)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      });
    setFriendAdded(false);
  };

  //LISTEN FOR FRIRENDS
  const addUserFriendsListeners = (channelId, userId) => {
    let mystring = currentChannel.id.replace(currentUser.uid, "");
    let privateChannel = mystring.replace("/", "");

    usersRef
      .child(userId)
      .child("friends")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const friendIds = Object.keys(data.val());
          const prevAdded = friendIds.includes(privateChannel);
          setFriendAdded(prevAdded);
          setFriendsList(allFriendsIds => [...allFriendsIds, friendIds]);
        }
      });
  };

  useEffect(() => {
    updateFriendsStatusListeners();
  }, [usersList]);

  const updateFriendsStatusListeners = () => {
    if (usersList && friendsList[0]) {
      const numberOfFriends = friendsList.length - 1;
      for (let i = 0; i < friendsList.length; i++) {
        usersList.forEach(element => {
          if (friendsList[numberOfFriends].includes(element.uid)) {
            let selectPrivateChannel = element.uid.replace(currentUser.uid, "");
            let privateChannel = selectPrivateChannel.replace("/", "");

            usersRef.child(`${currentUser.uid}/friends`).update({
              [privateChannel]: {
                channelId: element.uid,
                name: element.name,
                status: element.status,
                photoURL: element.photoURL
              }
            });
          }
        });
      }
    }
  };
  //SEARCH BAR
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
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

  //GET CURRENT MESSAGE REF
  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  //DISPLAYS CURRENT CHANNEL NAME
  const displayChannelName = () => {
    if (currentChannel && !isPrivateChannel) {
      return `#${currentChannel.name}`;
    } else if (currentChannel && isPrivateChannel) {
      return `@${currentChannel.name}`;
    } else {
      return "";
    }
  };

  //LISTEN FOR MESSAGES
  const addMessageListeners = () => {
    let loadedMessages = [];
    const ref = getMessagesRef();

    ref.child(currentChannel.id).on("child_added", snapshot => {
      loadedMessages.push(snapshot.val());

      setAllChannelMessages({ loadedMessages });
      setNoMessages(false);
    });
  };

  ////CHECKS IF MESSAGES WERE LOADED IN CURRENT CHANNEL
  const wereMessagesLoaded = () => {
    if (!messagesLoaded) {
      setNoMessages(true);
    } else {
      setNoMessages(false);
    }
  };

  //LOADS MESSAGES ONCE ON CHANNEL START
  const loadData = () => {
    messagesRef
      .child(currentChannel.id)
      .limitToLast(200)
      .once("value", snapshot => {})
      .then(snapshot => {
        if (snapshot) {
          if (snapshot.val()) {
          } else {
            wereMessagesLoaded();
          }
        }
      })
      .then(() => {
        setMessagesLoaded(true);
      });
  };

  //RENDERS ALL CHANNEL MESSAGES
  const renderMessages = () =>
    allChannelMessages.loadedMessages.map(message => {
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
    });

  //SCROLL TO THE BOTTOM OF CHANNEL WINDOW
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" }); //smooth
  };

  useEffect(() => {
    if (messagesLoaded === true) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messagesLoaded]);

  useEffect(() => {
    if (userTyping) scrollToBottom();
    else scrollToBottom();
  }, [userTyping]);
  ////////////////////////////////////////////////////////////

  return (
    <React.Fragment>
      <MessagesHeader
        handleSearchChange={handleSearchChange}
        displayChannelName={displayChannelName}
        searchLoading={searchLoading}
        isPrivateChannel={isPrivateChannel}
        handleStarred={handleStarred}
        unstarChannel={unstarChannel}
        channelStarred={channelStarred}
        friendAdded={friendAdded}
        handleAddFriend={handleAddFriend}
        unfriendPerson={unfriendPerson}
      ></MessagesHeader>

      <Segment>
        <Comment.Group className="messages">
          {/*shows messages skeleton on messages loading then checks if there is a messages in channel and displays "no messages" or shows all messages*/}
          {allChannelMessages.loadedMessages &&
          searchTerm === "" &&
          messagesLoaded
            ? renderMessages()
            : [
                noMessages
                  ? "No messages in the channel"
                  : [
                      allChannelMessages.loadedMessages &&
                      searchTerm === "" &&
                      messagesLoaded
                        ? renderMessages()
                        : [searchTerm === "" ? <SkeletonMessages /> : ""]
                    ]
              ]}

          {/*displays user name + usertypeing animation*/}

          {userTyping && userTyping.isUserTyping
            ? userTyping.userTypingUid !== currentUser.uid &&
              "User " + userTyping.userTypingName + " is writing"
            : ""}

          {userTyping && userTyping.isUserTyping
            ? userTyping.userTypingUid !== currentUser.uid && (
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
          <div ref={messagesEndRef} />
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
