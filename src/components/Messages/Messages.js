import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import TypingLoader from "./TypingLoader";

import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState, useEffect, useRef } from "react";
import { Steps } from "intro.js-react";

import { connect } from "react-redux";
import {
  setUserPosts,
  setCurrentChannel,
  setChannelFriended
} from "../../actions";
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
  const [noMessages, setNoMessages] = useState(true);
  const [searchResultEmpty, setSearchResultEmpty] = useState(false);

  const [pendingAdded, setPendingAdded] = useState(false);
  const [messageSend, setMessageSend] = useState(false);

  const [initialStep] = useState(0);
  const [options] = useState({
    showStepNumbers: false
  });
  const [steps] = useState([
    {
      element: ".friendsSegment",
      intro:
        "User and friends panel. Here you can change your user avatar, set page to dark mode, logout, display all friends added to your friend list and search users."
    },
    {
      element: ".messagesHeader",
      intro:
        "Channel header. Here you can add channels/friends to favourites by clicking star/plus, check details about channel, delete channel that was created by you, display all users and search messages in current channel."
    },
    {
      element: ".messages",
      intro: "Channel messages."
    },
    {
      element: ".messageForm",
      intro:
        "Sending messages. Here you can type and send your message, upload images to the channel and add emotes to your message."
    },
    {
      element: ".channelsSegment",
      intro:
        "Public channels panel. Here you can see your all channels added to your favourite list, search public channels and even add a new one by clicking yellow + button."
    }
  ]);

  const {
    currentChannel,
    currentUser,
    isPrivateChannel,
    userTyping,
    usersList,
    userPosts,
    usersInChannel,
    channelFriended,
    turnOnTutorial,
    turnOffTutorial,
    stepsEnabled,
    showSidebar,
    userRegistered
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
    loadAllChannelMessages();
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

        channelsRef
          .child(currentChannel.id)
          .update(newCurrentChannelInfo)
          .catch(err => {
            console.log(err);
          });

        props.setCurrentChannel(newCurrentChannelInfo);
      }
    }
  }, [messagesLoaded]);

  //ADD STARRED CHANNEL
  useEffect(() => {
    if (channelStarred) {
      usersRef
        .child(`${currentUser.uid}/starred`)
        .update({
          [currentChannel.id]: {
            name: currentChannel.name,
            details: currentChannel.details,
            createdBy: {
              uid: currentChannel.createdBy.uid,
              name: currentChannel.createdBy.name,
              avatar: currentChannel.createdBy.avatar
            }
          }
        })
        .catch(err => {
          console.log(err);
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
      })
      .catch(error => {
        console.log(error);
      });
  };

  //ADD FRIEND
  useEffect(() => {
    if (
      channelFriended &&
      currentChannel &&
      currentChannel.id &&
      currentUser &&
      currentUser.uid
    ) {
      let selectPrivateChannel = currentChannel.id.replace(currentUser.uid, "");
      let privateChannel = selectPrivateChannel.replace("/", "");

      if (pendingAdded) {
        usersRef
          .child(`${privateChannel}/pendingFriends`)
          .update({
            [currentUser.uid]: {
              id: currentUser.uid,
              name: currentUser.displayName,
              photoURL: currentUser.photoURL,
              status: currentChannel.status
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }, [channelFriended]);

  const handleAddFriend = () => {
    let selectPrivateChannel = currentChannel.id.replace(currentUser.uid, "");
    let privateChannel = selectPrivateChannel.replace("/", "");

    usersRef
      .child(`${currentUser.uid}/friends`)
      .update({
        [privateChannel]: {
          userId: currentChannel.id,
          name: currentChannel.name,
          status: currentChannel.status,
          photoURL: currentChannel.photoURL
        }
      })
      .catch(error => {
        console.log(error);
      });
    setPendingAdded(true);
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

    usersRef
      .child(`${privateChannel}/friends`)
      .child(currentUser.uid)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      });

    usersRef
      .child(`${privateChannel}/pendingFriends`)
      .child(currentUser.uid)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      });

    props.setChannelFriended(false);
    setPendingAdded(false);
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
          props.setChannelFriended(prevAdded);
          setFriendsList(allFriendsIds => [...allFriendsIds, friendIds]);
        }
      })
      .catch(err => {
        console.log(err);
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

            usersRef
              .child(`${currentUser.uid}/friends`)
              .update({
                [privateChannel]: {
                  channelId: element.uid,
                  name: element.name,
                  status: element.status,
                  photoURL: element.photoURL
                }
              })
              .catch(error => {
                console.log(error);
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

    if (searchResults.length === 0) {
      setSearchResultEmpty(true);
    } else {
      setSearchResultEmpty(false);
    }
    setTimeout(() => {
      setSearchLoading(false);
    }, 300);
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
      loadedMessages = loadedMessages.slice(
        Math.max(loadedMessages.length - 40, 0)
      );
      setAllChannelMessages({ loadedMessages });
      setNoMessages(false);
    });
  };

  useEffect(() => {
    if (userRegistered) {
      usersRef
        .child(currentUser.uid)
        .once("value", snapshot => {
          if (snapshot.val().tutorial) {
            showSidebar();
            turnOnTutorial();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [userRegistered]);

  //LOADS MESSAGES ONCE ON CHANNEL START
  const loadAllChannelMessages = () => {
    messagesRef
      .child(currentChannel.id)
      //.limitToLast(5)
      .once("value", snapshot => {})
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

  const messageSendScroll = () => {
    setMessageSend(true);
  };

  useEffect(() => {
    scrollToBottom();
    setMessageSend(false);
  }, [userTyping, messagesLoaded, messageSend]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 500);
    return () => clearTimeout(timer);
  }, [messageImageLoading]);

  ////////////////////////////////////////////////////////////

  const onExit = () => {
    if (messagesLoaded) turnOffTutorial();
  };

  useEffect(() => {
    if (stepsEnabled === false) {
      usersRef
        .child(currentUser.uid)
        .child("tutorial")
        .remove()
        .catch(error => {
          console.log(error);
        });
    }
  }, [stepsEnabled]);

  return (
    <React.Fragment>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
        options={options}
      />
      <MessagesHeader
        handleSearchChange={handleSearchChange}
        displayChannelName={displayChannelName}
        searchLoading={searchLoading}
        isPrivateChannel={isPrivateChannel}
        handleStarred={handleStarred}
        unstarChannel={unstarChannel}
        channelStarred={channelStarred}
        handleAddFriend={handleAddFriend}
        unfriendPerson={unfriendPerson}
        userPosts={userPosts}
        currentUser={currentUser}
        currentChannel={currentChannel}
        usersInChannel={usersInChannel}
        channelFriended={channelFriended}
      ></MessagesHeader>

      <Segment>
        <Comment.Group className="messages">
          {/*shows messages skeleton on messages loading then checks if there is a messages in channel and displays "no messages" or shows all messages*/}
          {!noMessages && messagesLoaded && searchTerm === ""
            ? renderMessages()
            : ""}
          {!messagesLoaded && searchTerm === "" ? <SkeletonMessages /> : ""}
          {allChannelMessages.loadedMessages === undefined && messagesLoaded
            ? "No messages"
            : ""}
          {/*displays user name + usertypeing animation*/}{" "}
          {userTyping &&
          userTyping.isTyping &&
          userTyping.channelId === currentChannel.id
            ? userTyping.uid !== currentUser.uid &&
              "User " + userTyping.name + " is writing"
            : ""}
          {userTyping &&
          userTyping.isTyping &&
          userTyping.channelId === currentChannel.id
            ? userTyping.uid !== currentUser.uid && (
                <TypingLoader></TypingLoader>
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
          {allChannelMessages.loadedMessages && searchTerm && searchResultEmpty
            ? "We couldn't find any messages/users with a given phrase"
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
        messageSendScroll={messageSendScroll}
      ></MessagesForm>
    </React.Fragment>
  );
};

export default connect(null, {
  setUserPosts,
  setCurrentChannel,
  setChannelFriended
})(Messages);
