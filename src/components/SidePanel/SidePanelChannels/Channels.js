import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Icon,
  Modal,
  Button,
  Form,
  Input,
  Message,
  Label,
  Divider
} from "semantic-ui-react";
import firebase from "../../Firebase";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setUsersInChannel,
  setChannelFriended
} from "../../../actions";
import usePrevious from "../../CustomHooks/usePrevious";

function Channels(props) {
  const [allChannels, setAllChannels] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [modal, setModal] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [channelDetail, setChannelDetail] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channelToRemove, setChannelToRemove] = useState(null);
  const [userInChannelToRemove, setUserInChannelToRemove] = useState(null);
  const [usersInCurrentChannel, setUsersInCurrentChannel] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchResultEmpty, setSearchResultEmpty] = useState(false);

  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const prevChannelId = usePrevious(activeChannelId);

  const {
    currentUser,
    isPrivateChannel,
    hideSidebar,
    favouriteNotActiveChange,
    favouriteActive
  } = props;

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleOpenModal = () => {
    setModal(true);
  };

  useEffect(() => {
    if (isPrivateChannel) {
      setActiveChannelId(null);
      clearNotifications(prevChannelId);

      if (prevChannelId && prevChannelId.length < 21) {
        channelsRef
          .child(prevChannelId)
          .child("usersInChannel")
          .child(currentUser.uid)
          .remove();
      }
    }
  }, [isPrivateChannel]);

  const handleChange = event => {
    if (event.target.name === "channelName") {
      setChannelName(event.target.value);
    } else if (event.target.name === "channelDetalis") {
      setChannelDetail(event.target.value);
    }
  };

  //ADD MAIN CHANNEL ON START
  useEffect(() => {
    addMainChannel();
    showChannelsListener();

    return () => {
      channelsRef.off();

      allChannels.forEach(channel => {
        messagesRef.child(channel.id).off();
      });
    };
  }, []);

  const showChannelsListener = () => {
    channelsRef.limitToFirst(200).on("child_added", snapshot => {
      setAllChannels(allChannels => [...allChannels, snapshot.val()]);
    });

    channelsRef.limitToFirst(200).on("child_removed", snapshot => {
      setChannelToRemove(snapshot.key);
    });
  };

  useEffect(() => {
    if (channelToRemove) {
      const filteredChannel = allChannels.filter(channel => {
        if (channel && channel.id !== channelToRemove) {
          return channel;
        } else {
          return null;
        }
      });
      setAllChannels(filteredChannel);
      setChannelToRemove(null);

      return () => {
        channelsRef.off();
        messagesRef.child(channelToRemove).off();
      };
    }
  }, [channelToRemove]);

  //////////////NOTIFICATIONS/////////////
  useEffect(() => {
    channelsRef.on("child_added", function(snap) {
      addNotificationListener(snap.key);
    });
  }, []);

  const addNotificationListener = channelId => {
    messagesRef.child(channelId).on("value", snapshot => {
      handleNotifications(channelId, activeChannelId, notifications, snapshot);
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

  //CLEARS NOTIFICATIONS
  const clearNotifications = () => {
    if (currentUser) {
      let index = notifications.findIndex(
        notification => notification.id === currentChannel.id
      );

      if (index !== -1) {
        let updatedNotifications = [...notifications];
        updatedNotifications[index].total = notifications[index].lastKnownTotal;
        updatedNotifications[index].count = 0;
        setNotifications(updatedNotifications);
      }
    }
  };

  //CHECKS IF ADD CHANNEL FORM IS VALID
  const isFormIsValid = () => {
    if (
      channelName.length < 3 ||
      channelDetail.length < 3 ||
      channelDetail.length > 20 ||
      channelDetail.length > 40
    ) {
      setError(
        "Channel name or channel detail is too short (atleast 3 characters)"
      );
      return false;
    } else if (channelDetail.length > 15 || channelDetail.length > 40) {
      setError(
        "Channel name or channel details is too long (maximum 15 characters for name and 40 for details)"
      );
      return false;
    } else {
      return true;
    }
  };

  const addMainChannel = () => {
    const mainChannel = {
      id: "mainChannel",
      name: "main channel",
      details: "This is main channel",
      createdBy: {
        uid: "111",
        name: "Admin",
        avatar: ""
      }
    };

    channelsRef
      .child("mainChannel")
      .update(mainChannel)
      .then(() => {
        props.setCurrentChannel(mainChannel);
        setCurrentChannel(mainChannel);
        setActiveChannelId(mainChannel.id);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //ADD A NEW CHANNEL
  const handleAddChannel = () => {
    // Get the unique key generated by push()
    const newPostRef = channelsRef.push();
    const refKey = newPostRef.key;

    const newChannel = {
      id: refKey,
      name: channelName.toLowerCase(),
      details: channelDetail,
      createdBy: {
        uid: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    channelsRef
      .child(refKey)
      .update(newChannel)
      .then(() => {
        setChannelName("");
        setChannelDetail("");
        handleCloseModal();
        console.log("channel added");
      })
      .catch(error => {
        console.log(error);
      });
  };

  //IF FORM IS VALID AND THE SAME CHANNEL NAME ISNT IN DATABASE THEN HANDLENEWCHANNEL()
  const handleSubmit = event => {
    event.preventDefault();
    let error = "";
    allChannels.forEach(element => {
      if (element.name === channelName) {
        error = "error";
        setError("Channel name already exists");
      }
    });

    if (isFormIsValid() && error === "") {
      handleAddChannel();
    }
  };

  //CURRENT USERS IN CHANEL
  const currentUsersInChannel = channel => {
    const user = {
      uid: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL
    };

    if (
      !isPrivateChannel &&
      prevChannelId &&
      channel &&
      prevChannelId !== channel.id
    ) {
      channelsRef
        .child(channel.id)
        .child("usersInChannel")
        .child(currentUser.uid)
        .set(user)
        .catch(error => {
          console.log(error);
        });

      channelsRef
        .child(prevChannelId)
        .child("usersInChannel")
        .child(currentUser.uid)
        .remove();
    }

    if (prevChannelId === null) {
      channelsRef
        .child(channel.id)
        .child("usersInChannel")
        .child(currentUser.uid)
        .set(user)
        .catch(error => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (currentChannel && currentChannel.id === "mainChannel") {
      const mainChannel = {
        id: "mainChannel",
        name: "main channel"
      };
      currentUsersInChannel(mainChannel);
      currentChannelUsersListener(mainChannel);
    }
  }, [currentChannel]);

  //LISTENS FOR CURRENT USERS IN CHANNEL
  const currentChannelUsersListener = channel => {
    channelsRef
      .child(channel.id)
      .child("usersInChannel")
      .on("child_added", snapshot => {
        if (currentUser.uid !== snapshot.key) {
          setUsersInCurrentChannel(users => [...users, snapshot.val()]);
        }
      });

    channelsRef
      .child(channel.id)
      .child("usersInChannel")
      .on("child_removed", snapshot => {
        if (currentUser.uid !== snapshot.key) {
          setUserInChannelToRemove(snapshot.key);
        }
      });
  };

  useEffect(() => {
    if (userInChannelToRemove) {
      const filteredUsers = usersInCurrentChannel.filter(user => {
        if (user && user.uid !== userInChannelToRemove) {
          return user;
        } else {
          return null;
        }
      });
      setUsersInCurrentChannel(filteredUsers);
      setUserInChannelToRemove(null);
    }
  }, [userInChannelToRemove]);
  console.log(usersInCurrentChannel);
  useEffect(() => {
    if (usersInCurrentChannel) {
      const uniqueUsers = Array.from(
        new Set(usersInCurrentChannel.map(a => a.id))
      ).map(id => {
        return usersInCurrentChannel.find(a => a.id === id);
      });

      props.setUsersInChannel(uniqueUsers);
    }
  }, [usersInCurrentChannel]);

  //CHANGE CURRENT CHANNEL
  const changeChannel = channel => {
    props.setChannelFriended(false);
    setUsersInCurrentChannel([]);
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
    setCurrentChannel(channel);
    hideSidebar();

    setActiveChannelId(channel.id);

    clearNotifications(prevChannelId);
    clearNotifications();

    favouriteNotActiveChange();
    currentUsersInChannel(channel);
    currentChannelUsersListener(channel);

    //TURNS OFF CURRENT CHANNEL LISTENER FOR CURRENT USERS LISTENER
    if (
      !isPrivateChannel &&
      prevChannelId &&
      channel &&
      prevChannelId !== channel.id
    ) {
      channelsRef
        .child(prevChannelId)
        .child("usersInChannel")
        .off();
    }
  };

  //DISPLAYS  CHANNELS
  const displayChannels = () => {
    if (allChannels) {
      if (firstLoad && allChannels[0]) {
        props.setPrivateChannel(false);
        setFirstLoad(false);
      }
      return allChannels
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(channel => (
          <Menu.Item
            key={channel.id}
            onClick={() => changeChannel(channel)}
            name={channel.name}
            active={!favouriteActive && activeChannelId === channel.id}
          >
            {channel.id !== activeChannelId &&
              getNotificationCount(channel) && (
                <Label color="red">{getNotificationCount(channel)}</Label>
              )}
            <span style={{ color: "#ffbf00" }}> # {channel.name}</span>
          </Menu.Item>
        ));
    }
  };

  //DISPLAYS SEARCHED CHANNELS
  const displaySearchedChannels = () => {
    if (allChannels) {
      return searchResult.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => changeChannel(channel)}
          name={channel.name}
          active={!favouriteActive && activeChannelId === channel.id}
        >
          <span style={{ color: "	#ffbf00" }}># {channel.name}</span>
        </Menu.Item>
      ));
    }
  };

  const checkIfSearchedChannelsEmpty = () => {
    if (searchResultEmpty) {
      return (
        <Menu.Item style={{ opacity: 0.7 }}>
          <span style={{ color: "#ffbf00" }}>
            We couldn't find any channel with that name
          </span>
        </Menu.Item>
      );
    }
  };

  //SEARCH BAR
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);

    setSearchLoading(true);
    setTimeout(() => {
      setSearchLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchMessages();
    } else {
      setSearchResult([]);
    }
  }, [searchTerm]);

  //CHANNELS SEARCH
  const handleSearchMessages = () => {
    const allPublicChannels = [...allChannels];

    const regex = new RegExp(searchTerm, "gi");
    const searchResults = allPublicChannels.reduce((acc, channel) => {
      if (channel.name && channel.name.match(regex)) {
        acc.push(channel);
      }
      return acc;
    }, []);

    setSearchResult(searchResults);

    if (searchResults.length === 0) {
      setSearchResultEmpty(true);
    } else {
      setSearchResultEmpty(false);
    }
  };

  return (
    <React.Fragment>
      <Divider clearing />

      <Menu.Item>
        <span style={{ color: "	#ffbf00" }}>
          <Icon name="search"></Icon> SEARCH CHANNELS
        </span>
      </Menu.Item>

      <Menu.Item>
        <Input
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          loading={searchLoading}
          placeholder="SEARCH CHANNELS"
        ></Input>
      </Menu.Item>

      {displaySearchedChannels()}
      {checkIfSearchedChannelsEmpty()}
      <Divider clearing />
      <Menu.Item>
        <span style={{ color: "#ffbf00" }}>
          <Icon name="comments"></Icon> CHANNELS {"  "}(
          {allChannels !== undefined && allChannels.length})
        </span>

        <Icon
          onClick={handleOpenModal}
          style={{ color: "#ffbf00" }}
          name="add"
        ></Icon>
      </Menu.Item>
      {displayChannels()}

      <Modal open={modal} onClose={handleCloseModal} size="small">
        <Modal.Header>Add chanel</Modal.Header>

        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of the channel"
                name="channelName"
                onChange={handleChange}
              ></Input>
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the channel"
                name="channelDetalis"
                onChange={handleChange}
              ></Input>
            </Form.Field>
          </Form>
          {error !== "" && (
            <Message error>
              {" "}
              <h3>Error</h3>
              {error}
            </Message>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className={loading ? "checkmark" : ""}
            color="green"
          >
            Add
          </Button>
          <Button
            disabled={loading}
            onClick={handleCloseModal}
            className={"cancel"}
            color="red"
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
      <Divider clearing />
    </React.Fragment>
  );
}

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setUsersInChannel,
  setChannelFriended
})(Channels);
