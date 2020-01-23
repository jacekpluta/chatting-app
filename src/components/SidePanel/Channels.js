import React, { useState, useEffect } from "react";
import {
  Menu,
  Icon,
  Modal,
  Button,
  Form,
  Input,
  Message,
  Label
} from "semantic-ui-react";
import firebase from "../Firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

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
  const [channelChanged, setChannelChanged] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [messagesRef] = useState(firebase.database().ref("messages"));

  const { currentUser, isPrivateChannel, userPosts } = props;

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
    showChannelsListener();

    return () => {
      channelsRef.off();
      clearNotifications();
      allChannels.forEach(channel => {
        messagesRef.child(channel.id).off();
      });
    };
  }, []);

  const showChannelsListener = () => {
    channelsRef.limitToFirst(200).on("child_added", snapshot => {
      setAllChannels(allChannels => [...allChannels, snapshot.val()]);
    });
  };

  //////////////NOTIFICATIONS/////////////
  useEffect(() => {
    channelsRef.on("child_added", function(snap) {
      addNotificationListener(snap.key);
    });
  }, [channelChanged]);

  const addNotificationListener = channelId => {
    messagesRef.child(channelId).on("value", snapshot => {
      if (channelChanged) {
        handleNotifications(
          channelId,
          activeChannelId,
          notifications,
          snapshot
        );
      }
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

  const clearNotifications = () => {
    if (currentUser && currentUser.id) {
      let index = notifications.findIndex(
        notification => notification.id === channelChanged.id
      );

      if (index !== -1) {
        let updatedNotifications = [...notifications];
        updatedNotifications[index].total = notifications[index].lastKnownTotal;
        updatedNotifications[index].count = 0;
        setNotifications(updatedNotifications);
      }
    }
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
      })
      .then(() => {
        setCurrentChannel(mainChannel);
        setChannelChanged(mainChannel);
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

    if (isFormIsValid()) {
      handleAddChannel();
    }
  };

  const changeChannel = channel => {
    setActiveChannelId(channel.id);
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
    setChannelChanged(channel);
    clearNotifications();
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
            active={activeChannelId === channel.id}
          >
            {channel.id !== activeChannelId &&
              getNotificationCount(channel) && (
                <Label color="red">{getNotificationCount(channel)}</Label>
              )}
            # {channel.name}
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
          active={activeChannelId === channel.id}
        >
          # {channel.name}
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
    }, 1000);
  };

  return (
    <React.Fragment>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange"></Icon> CHANNELS
          </span>
          {"  "}({allChannels !== undefined && allChannels.length})
          <Icon onClick={handleOpenModal} name="add"></Icon>
        </Menu.Item>
        {displayChannels()}
        <Menu.Item>
          <span>
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
            placeholder="Search channels"
          ></Input>
        </Menu.Item>

        {displaySearchedChannels()}
      </Menu.Menu>

      <Modal open={modal} onClose={handleCloseModal} basic size="small">
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
    </React.Fragment>
  );
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
