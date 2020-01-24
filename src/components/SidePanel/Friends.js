import React, { useState, useEffect } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebase from "../Firebase";

const Friends = props => {
  const [friendsChannels, setFriendsChannels] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [usersRef] = useState(firebase.database().ref("users"));
  const { currentUser, isPrivateChannel, usersList } = props;

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
  }, [usersList]);

  const addListenersFriendAdded = userId => {
    let friends = [];

    usersRef
      .child(userId)
      .child("friends")
      .on("child_added", snapshot => {
        if (currentUser.uid !== snapshot.key) {
          friends.push(snapshot.val());
          setFriendsChannels(friends);
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

  const changePrivateChannel = friendChannel => {
    const privateChannelData = {
      id: friendChannel.channelId,
      name: friendChannel.name,
      status: friendChannel.status,
      photoURL: friendChannel.photoURL
    };
    setActiveChannelId(friendChannel.id);
    props.setCurrentChannel(privateChannelData);
    props.setPrivateChannel(true);
  };

  const displayFriendChannels = () => {
    return friendsChannels
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(friendChannel => (
        <Menu.Item
          key={friendChannel.id}
          onClick={() => changePrivateChannel(friendChannel)}
          name={friendChannel.name}
          active={activeChannelId === friendChannel.id}
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
