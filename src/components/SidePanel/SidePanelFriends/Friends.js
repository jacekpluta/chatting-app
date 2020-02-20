import React, { useState, useEffect } from "react";
import {
  Menu,
  Icon,
  Image,
  Divider,
  Popup,
  Button,
  List
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId
} from "../../../actions";
import firebase from "../../Firebase";

const Friends = props => {
  const [friendsChannels, setFriendsChannels] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [friendPendingToRemove, setFriendPendingToRemove] = useState(null);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendAdded, setFriendAdded] = useState(false);

  const [usersRef] = useState(firebase.database().ref("users"));
  const {
    currentUser,
    isPrivateChannel,
    usersList,
    hideSidbar,
    friendsMarkActive,
    friendsMarkActiveChange,
    privateActiveChannelId,
    currentChannel
  } = props;

  useEffect(() => {
    if (!isPrivateChannel) {
      props.setActiveChannelId(null);
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

  console.log(pendingFriends);

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
      });
  };

  useEffect(() => {
    if (friendToRemove) {
      const filteredFriend = friendsChannels.filter(friendChannel => {
        if (friendChannel.id !== friendToRemove) return friendChannel;
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
    hideSidbar();
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
      });

    setFriendAdded(true);
  };

  useEffect(() => {
    if (friendAdded) {
      let selectPrivateChannel = currentChannel.id.replace(currentUser.uid, "");
      let privateChannel = selectPrivateChannel.replace("/", "");

      setFriendPendingToRemove(privateChannel);

      usersRef.child(`${currentUser.uid}/friends`).update({
        [privateChannel]: {
          userId: currentChannel.id,
          name: currentChannel.name,
          status: currentChannel.status,
          photoURL: currentChannel.photoURL
        }
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
            active={
              friendsMarkActive && privateActiveChannelId === friendChannel.id
            }
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
            <span style={{ color: "#39ff14" }}> {friendChannel.name}</span>
          </Menu.Item>
        ));
    }
  };

  const displayPendingFriends = () => {
    if (pendingFriends) {
      console.log(pendingFriends);
      console.log(friendsChannels);

      //substracts friends from friend pendings
      let onlyPendings = pendingFriends.filter(
        x => !friendsChannels.filter(y => y.id === x.id).length
      );

      const uniquePendings = Array.from(
        new Set(onlyPendings.map(a => a.id))
      ).map(id => {
        return onlyPendings.find(a => a.id === id);
      });

      return uniquePendings
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(pendingFriend => (
          <Popup
            flowing
            hoverable
            trigger={
              <Button color="red" size="mini" style={{ color: "white" }}>
                <Icon name="exclamation"></Icon> ({pendingFriends.length})
              </Button>
            }
          >
            {/* <Menu.Item
              key={pendingFriend.user}
              onClick={() => {
                changeChannel(pendingFriend);
              }}
              name={pendingFriend.name}
              // active={
              //   friendsMarkActive && privateActiveChannelId === pendingFriend.id
              // }
            > */}
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
                      style={{ color: "#39ff14" }}
                    >
                      {pendingFriend.name}
                    </h4>
                  </List.Header>
                  <List.Description>
                    <h4
                      onClick={() => {
                        changeChannel(pendingFriend);
                      }}
                    >
                      <a>
                        <b>just added you to friends.</b>
                      </a>{" "}
                      Do you want to add him too?{"  "}
                      <Icon
                        name="check"
                        size="large"
                        color="green"
                        onClick={() => {
                          handleRemovePendingAddFriend(pendingFriend.id);
                          console.log("lol");
                        }}
                      ></Icon>
                      <Icon
                        name="x"
                        size="large"
                        color="red"
                        onClick={() => {
                          handleRemovePending(pendingFriend.id);
                          console.log("lol");
                        }}
                      ></Icon>
                    </h4>
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Popup>
        ));
    }
  };

  return (
    <React.Fragment>
      <Menu.Item>
        <span style={{ color: "#39ff14" }}>
          <Icon name="address book"></Icon> FRIENDS ({friendsChannels.length})
          {"   "}
          {displayPendingFriends()}
        </span>
        {friendsChannels.lenght}
      </Menu.Item>

      {displayFriendChannels()}

      <Divider clearing />
    </React.Fragment>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId
})(Friends);
