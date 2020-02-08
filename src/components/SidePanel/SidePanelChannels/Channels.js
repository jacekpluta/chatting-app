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
  setUsersInChannel
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

  // const [userToRemove, setUserToRemove] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const prevChannelId = usePrevious(activeChannelId);

  const {
    currentUser,
    isPrivateChannel,
    hideSidbar,
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
  }, []);

  useEffect(() => {
    if (activeChannelId !== "Main channel") {
      currentChannelUsersListener();
    }
  }, [currentChannel]);

  useEffect(() => {
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
  }, [notifications]);

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

  const currentChannelUsersListener = () => {
    if (activeChannelId) {
      let channelUsers = [];
      channelsRef
        .child(activeChannelId)
        .child("usersInChannel")
        .on("child_added", snapshot => {
          channelUsers.push(snapshot.val());

          props.setUsersInChannel(channelUsers);
        });

      // channelsRef
      //   .child(activeChannelId)
      //   .child("usersInChannel")
      //   .on("child_removed", snapshot => {
      //     setUserToRemove(snapshot.key);
      //   });
    }
  };

  // useEffect(() => {
  //   if (userToRemove) {
  //     const filteredChannel = usersInChannel.filter(user => {

  //       if (user && user.uid !== userToRemove) {
  //         return user;
  //       }
  //     });
  //     setUsersInChannel(filteredChannel);
  //     props.setUsersInChannel(filteredChannel);
  //     setUserToRemove(null);
  //   }
  // }, [userToRemove]);

  const changeChannel = channel => {
    hideSidbar();
    setActiveChannelId(channel.id);
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
    setCurrentChannel(channel);
    clearNotifications();
    favouriteNotActiveChange();

    if (!isPrivateChannel && prevChannelId !== channel.id) {
      channelsRef
        .child(prevChannelId)
        .child("usersInChannel")
        .child(currentUser.uid)
        .remove();

      const user = {
        uid: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      };

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

  //SEARCH BAR
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
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
    setTimeout(() => {
      setSearchLoading(false);
    }, 300);
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
  setUsersInChannel
})(Channels);
