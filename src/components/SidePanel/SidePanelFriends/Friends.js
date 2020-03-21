import React, { useState, useEffect } from "react";
import {
  Menu,
  Icon,
  Image,
  Popup,
  Button,
  List,
  Label
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId,
  setChannelFriended
} from "../../../actions";
import firebase from "../../Firebase";
import usePrevious from "../../CustomHooks/usePrevious";

const Friends = props => {
  const {
    currentUser,
    isPrivateChannel,
    usersList,
    hideSidebar,
    friendsMarkActive,
    friendsMarkActiveChange,
    activeChannelId,
    currentChannel
  } = props;

  const [friendsChannels, setFriendsChannels] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(false);
  const [friendPendingToRemove, setFriendPendingToRemove] = useState(null);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendAdded, setFriendAdded] = useState(false);
  const [uniqueFriendsPendings, setUniqueFriendsPendings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const prevChannelId = usePrevious(activeChannelId);

  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [usersRef] = useState(firebase.database().ref("users"));

  useEffect(() => {
    if (!isPrivateChannel) {
      clearNotifications(prevChannelId);
    }
  }, [isPrivateChannel]);

  useEffect(() => {
    if (currentUser) {
      addListenersFriendAdded(currentUser.uid);
      addListenersFriendRemoved(currentUser.uid);
      addListenersPendingFriend(currentUser.uid);
      addListenersPendingFriendRemoved(currentUser.uid);
    }

    return () => {
      usersRef.off();
    };
  }, []);

  //NOTIFICATIONS
  useEffect(() => {
    if (currentChannel && isPrivateChannel) {
      addUsersFriendsListener(currentChannel.id);
    }
  }, [currentChannel]);

  const addUsersFriendsListener = () => {
    usersRef
      .child(currentUser.uid)
      .child("friends")
      .on("child_added", function(snap) {
        if (snap.key !== currentUser.uid) {
          addNotificationListener(snap.key);
        }
      });
  };

  const addNotificationListener = channelId => {
    privateMessagesRef.child(getChannelId(channelId)).on("value", snapshot => {
      handleNotifications(
        channelId,
        currentChannel.id,
        notifications,
        snapshot
      );
    });
  };

  const handleNotifications = (
    channelId,
    currentChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }
    setNotifications(notifications);
  };

  const getNotificationCount = channel => {
    let count = 0;

    notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  //CLEARS NOTIFICATIONS ON CHANNEL CHANGE
  const clearNotifications = friendChannelId => {
    if (currentUser) {
      let index = notifications.findIndex(
        notification => notification.id === friendChannelId
      );

      if (index !== -1) {
        let updatedNotifications = [...notifications];
        updatedNotifications[index].total = notifications[index].lastKnownTotal;
        updatedNotifications[index].count = 0;
        setNotifications(updatedNotifications);
      }
    }
  };

  const addListenersFriendAdded = userId => {
    usersRef
      .child(userId)
      .child("friends")
      .on("child_added", snapshot => {
        if (currentUser.uid !== snapshot.key) {
          const friendToAdd = { id: snapshot.key, ...snapshot.val() };

          setFriendsChannels(friendedChannels => [
            ...friendedChannels,
            friendToAdd
          ]);
        }
      });
  };

  const addListenersPendingFriend = userId => {
    usersRef
      .child(userId)
      .child("pendingFriends")
      .on("child_added", snapshot => {
        setPendingFriends(pendingFriends => [
          ...pendingFriends,
          snapshot.val()
        ]);
      });
  };

  const addListenersPendingFriendRemoved = userId => {
    usersRef
      .child(userId)
      .child("pendingFriends")
      .on("child_removed", snapshot => {
        setFriendPendingToRemove(snapshot.key);
      });
  };

  const addListenersFriendRemoved = userId => {
    usersRef
      .child(userId)
      .child("friends")
      .on("child_removed", snapshot => {
        setFriendToRemove(snapshot.key);
        props.setChannelFriended(false);
      });
  };

  useEffect(() => {
    if (friendToRemove) {
      const filteredFriend = friendsChannels.filter(friendChannel => {
        if (friendChannel.id !== friendToRemove) return friendChannel;
        else {
          return null;
        }
      });
      setFriendsChannels(filteredFriend);
      setFriendToRemove(null);
    }
  }, [friendToRemove]);

  useEffect(() => {
    if (friendPendingToRemove) {
      const filteredPendingFriend = pendingFriends.filter(
        friendPendingChannel => {
          if (friendPendingChannel.id !== friendPendingToRemove)
            return friendPendingChannel;
          else {
            return null;
          }
        }
      );
      setPendingFriends(filteredPendingFriend);
      setFriendPendingToRemove(null);
    }
  }, [friendPendingToRemove]);

  //GETS PRIVATE CHANNEL ID
  const getChannelId = userId => {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUser.uid}`
      : `${currentUser.uid}/${userId}`;
  };

  //CHANGE PRIVATE CHANNEL
  const changeChannel = friendChannel => {
    const channelId = getChannelId(friendChannel.id);

    const privateChannelData = {
      id: channelId,
      name: friendChannel.name,
      status: friendChannel.status,
      photoURL: friendChannel.photoURL
    };

    props.setActiveChannelId(friendChannel.id);
    props.setCurrentChannel(privateChannelData);
    props.setPrivateChannel(true);
    hideSidebar();
    clearNotifications(prevChannelId);
    clearNotifications(friendChannel.id);
    friendsMarkActiveChange();
  };

  const handleRemovePending = pendingId => {
    usersRef
      .child(`${currentUser.uid}/pendingFriends`)
      .child(pendingId)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      });
  };

  const handleRemovePendingAddFriend = pendingId => {
    usersRef
      .child(`${currentUser.uid}/pendingFriends`)
      .child(pendingId)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      })
      .then(() => {
        setFriendAdded(true);
        props.setChannelFriended(true);
      });
  };

  useEffect(() => {
    if (friendAdded) {
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
        .then(() => {
          setFriendAdded(false);
          setFriendPendingToRemove(privateChannel);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [friendAdded]);

  const displayFriendChannels = () => {
    if (usersList && friendsChannels) {
      const friendsList = usersList.filter(o1 =>
        friendsChannels.some(o2 => o1.id === o2.id)
      );

      return friendsList
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(friendChannel => (
          <Menu.Item
            key={friendChannel.id}
            onClick={() => changeChannel(friendChannel)}
            name={friendChannel.name}
            active={friendsMarkActive && activeChannelId === friendChannel.id}
          >
            <Icon
              name="circle"
              color={friendChannel && friendChannel.status ? "green" : "red"}
            ></Icon>

            {friendChannel ? (
              <Image
                src={friendChannel.photoURL}
                style={{ width: "10%", height: "10%" }}
                avatar
              ></Image>
            ) : (
              ""
            )}
            {friendChannel.id !== activeChannelId &&
              getNotificationCount(friendChannel) && (
                <Label color="red">{getNotificationCount(friendChannel)}</Label>
              )}

            <span style={{ color: "white" }}> {friendChannel.name}</span>
          </Menu.Item>
        ));
    }
  };
  useEffect(() => {
    uniquePendings();
  }, [pendingFriends]);

  const uniquePendings = () => {
    //substracts friends from friend pendings
    const onlyPendings = pendingFriends.filter(
      x => !friendsChannels.filter(y => y.id === x.id).length
    );

    //deletes duplicates
    const uniquePendings = Array.from(new Set(onlyPendings.map(a => a.id))).map(
      id => {
        return onlyPendings.find(a => a.id === id);
      }
    );
    setUniqueFriendsPendings(uniquePendings);
  };

  const displayPendingFriends = () => {
    if (uniqueFriendsPendings) {
      return uniqueFriendsPendings
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(pendingFriend => (
          <List>
            <List.Item>
              <Image
                src={pendingFriend.photoURL}
                style={{ width: "10%", height: "10%" }}
                avatar
              />
              <List.Content>
                <List.Header as="a">
                  {" "}
                  <h4
                    key={pendingFriend.user}
                    onClick={() => {
                      changeChannel(pendingFriend);
                    }}
                    style={{ color: "black" }}
                  >
                    <b> {pendingFriend.name}</b>
                  </h4>
                </List.Header>
                <List.Description>
                  <h4
                    onClick={() => {
                      changeChannel(pendingFriend);
                    }}
                  >
                    <b>just added you to friends.</b> {"  "}
                    Do you want to add him too?{"  "}
                    <Icon
                      name="check"
                      size="large"
                      color="green"
                      onClick={() => {
                        handleRemovePendingAddFriend(pendingFriend.id);
                      }}
                    ></Icon>
                    <Icon
                      name="x"
                      size="large"
                      color="red"
                      onClick={() => {
                        handleRemovePending(pendingFriend.id);
                      }}
                    ></Icon>
                  </h4>
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
        ));
    }
  };

  return (
    <React.Fragment>
      <Menu.Item>
        <span style={{ color: "white", paddingBottom: "5px" }}>
          <Icon name="users"></Icon> FRIENDS ({friendsChannels.length}){"   "}
        </span>
        {friendsChannels.lenght}
        {uniqueFriendsPendings.length !== 0 ? (
          <Popup
            flowing
            hoverable
            trigger={
              <Button
                color="orange"
                size="mini"
                compact
                style={{ color: "white" }}
              >
                <Icon name="exclamation"></Icon> ({uniqueFriendsPendings.length}
                )
              </Button>
            }
          >
            {displayPendingFriends()}
          </Popup>
        ) : (
          ""
        )}
      </Menu.Item>

      {displayFriendChannels()}
    </React.Fragment>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId,
  setChannelFriended
})(Friends);
