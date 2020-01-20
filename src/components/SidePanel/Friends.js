import React, { useState, useEffect } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebase from "../Firebase";

const Friends = props => {
  const [friendsChannels, setFriendsChannels] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [activeFriends, setActiveFriends] = useState([]);
  const [usersRef] = useState(firebase.database().ref("users"));
  const { currentUser, currentChannel, usersList } = props;

  //PRZEECIEC USERS LIST I DODAC DO FRIENDSOW AVATARY I STATUS//////////////

  useEffect(() => {
    if (currentUser) {
      addListenersFriendAdded(currentUser.uid, friendsChannels);
      addListenersFriendRemoved(
        currentUser.uid,
        friendsChannels,
        currentChannel
      );
    }

    return () => {
      usersRef.off();
    };
  }, [currentUser]);

  const addListenersFriendAdded = userId => {
    usersRef
      .child(userId)
      .child("friends")
      .on("child_added", snapshot => {
        const friendToAdd = { id: snapshot.key, ...snapshot.val() };
        setFriendsChannels(friendedUsers => [...friendedUsers, friendToAdd]);
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

  const changeChannel = friendChannel => {
    const channelData = {
      id: friendChannel.channelId,
      name: friendChannel.name,
      status: friendChannel.status,
      photoURL: friendChannel.photoURL
    };

    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
  };

  const displayFriendChannels = () => {
    return friendsChannels.map(friendChannel => (
      <Menu.Item
        key={friendChannel.id}
        onClick={() => changeChannel(friendChannel)}
        name={friendChannel.name}
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

        {friendChannel.name}
      </Menu.Item>
    ));
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star"></Icon> FRIENDS ({friendsChannels.length})
        </span>
        {friendsChannels.lenght}
      </Menu.Item>

      {displayFriendChannels()}
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(Friends);
