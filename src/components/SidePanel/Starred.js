import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebase from "../Firebase";

const Starred = props => {
  const [starredChannels, setStarredChannels] = useState([]);
  const [channelToRemove, setChannelToRemove] = useState(null);
  const [usersRef] = useState(firebase.database().ref("users"));
  const { currentUser, currentChannel } = props;

  useEffect(() => {
    if (currentUser) {
      addListenersStarAdded(currentUser.uid);
      addListenersStarRemoved(currentUser.uid, currentChannel);
    }

    return () => {
      usersRef.off();
    };
  }, [currentUser]);

  const addListenersStarAdded = userId => {
    usersRef
      .child(userId)
      .child("starred")
      .on("child_added", snapshot => {
        const channelToStar = { id: snapshot.key, ...snapshot.val() };

        setStarredChannels(starredChannels => [
          ...starredChannels,
          channelToStar
        ]);
      });
  };

  const addListenersStarRemoved = userId => {
    usersRef
      .child(userId)
      .child("starred")
      .on("child_removed", snapshot => {
        setChannelToRemove(snapshot.key);
      });
  };

  useEffect(() => {
    if (channelToRemove) {
      const filteredChannel = starredChannels.filter(channel => {
        if (channel && channel.id !== channelToRemove) {
          return channel;
        } else {
          return null;
        }
      });
      setStarredChannels(filteredChannel);
      setChannelToRemove(null);
    }
  }, [channelToRemove]);

  const changeChannel = channel => {
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
  };

  const displayChannels = starredChannels => {
    return starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
      >
        # {channel.name}
      </Menu.Item>
    ));
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star"></Icon> FAV CHANNELS ({starredChannels.length})
        </span>
        {starredChannels.lenght}
      </Menu.Item>

      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
