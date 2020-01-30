import React, { useState, useEffect } from "react";
import { Menu, Icon, Image, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebase from "../Firebase";

const Friends = props => {
  const [friendsChannels, setFriendsChannels] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [usersRef] = useState(firebase.database().ref("users"));
  const {
    currentUser,
    isPrivateChannel,
    usersList,
    hideSidbar,
    friendsMarkActive,
    friendsMarkActiveChange
  } = props;

  useEffect(() => {
    if (!isPrivateChannel) {
      setActiveChannelId(null);
    }
  }, [isPrivateChannel]);

  useEffect(() => {
    if (currentUser) {
      addListenersFriendAdded(currentUser.uid);
      addListenersFriendRemoved(currentUser.uid);
    }

    return () => {
      usersRef.off();
    };
  }, []);

  const addListenersFriendAdded = userId => {
    usersRef
      .child(userId)
      .child("friends")
      .on("child_added", snapshot => {
        if (currentUser.uid !== snapshot.key) {
          const friendToStar = { id: snapshot.key, ...snapshot.val() };

          setFriendsChannels(friendedChannels => [
            ...friendedChannels,
            friendToStar
          ]);
        }
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

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUser.uid}`
      : `${currentUser.uid}/${userId}`;
  };

  const changeChannel = friendChannel => {
    const channelId = getChannelId(friendChannel.id);

    const privateChannelData = {
      id: channelId,
      name: friendChannel.name,
      status: friendChannel.status,
      photoURL: friendChannel.photoURL
    };

    setActiveChannelId(friendChannel.id);
    props.setCurrentChannel(privateChannelData);
    props.setPrivateChannel(true);
    hideSidbar();
    friendsMarkActiveChange();
  };

  const displayFriendChannels = () => {
    if (usersList && friendsChannels) {
      let result = usersList.filter(o1 =>
        friendsChannels.some(o2 => o1.id === o2.id)
      );

      return result
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
            <span style={{ color: "#21ba45" }}> {friendChannel.name}</span>
          </Menu.Item>
        ));
    }
  };

  return (
    <React.Fragment>
      <Menu.Item>
        <span style={{ color: "#21ba45" }}>
          <Icon name="star"></Icon> FRIENDS ({friendsChannels.length})
        </span>
        {friendsChannels.lenght}
      </Menu.Item>

      {displayFriendChannels()}
      <Divider clearing />
    </React.Fragment>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(Friends);
