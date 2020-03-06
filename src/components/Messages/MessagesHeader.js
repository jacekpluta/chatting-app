import React, { useState } from "react";

import {
  Header,
  Segment,
  Input,
  Icon,
  Popup,
  Button,
  List,
  Image
} from "semantic-ui-react";
import MetaPanel from "../SidePanel/MetaPanel/MetaPanel";
import DeleteChannelModal from "../SidePanel/MetaPanel/DeleteChannelModal";
import { connect } from "react-redux";
import firebase from "../Firebase";
import {
  setCurrentChannel,
  setActiveChannelId,
  setPrivateChannel
} from "../../actions";

const MessagesHeader = props => {
  const {
    displayChannelName,
    handleSearchChange,
    searchLoading,
    isPrivateChannel,
    handleStarred,
    channelStarred,
    unstarChannel,
    handleAddFriend,
    handleUnfriendPerson,
    currentChannel,
    userPosts,
    currentUser,
    usersInChannel,
    channelFriended
  } = props;
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channelsRef] = useState(firebase.database().ref("channels"));

  const handleDisablePopup = () => {
    setPopupOpen(false);
  };

  const handleEnablePopup = () => {
    setPopupOpen(true);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleDisablePopup();
  };

  const handleDeleteChannel = () => {
    setLoading(true);

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
      .child(currentChannel.id)
      .remove(err => {
        if (err !== null) {
          console.log(err);
        }
      })
      .then(() => {
        setLoading(false);
        props.setCurrentChannel(mainChannel);
        props.setActiveChannelId(mainChannel.id);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUser.uid}`
      : `${currentUser.uid}/${userId}`;
  };

  const changeChannel = user => {
    const channelId = getChannelId(user.id);

    const privateChannelData = {
      id: channelId,
      name: user.name,
      photoURL: user.avatar
    };

    props.setActiveChannelId(user.id);
    props.setCurrentChannel(privateChannelData);
    props.setPrivateChannel(true);
  };

  //CHECKS IF THERE ARE USERS IN CURRENT CHANNEL
  const isEmpty = obj => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  //DISPLAYS CURRENT USERS IN CHANNEL
  const displayUsersInChannel = () =>
    usersInChannel
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(user => (
        <List>
          <List.Item
            key={user.uid}
            name={user.name}
            onClick={() => changeChannel(user)}
            // active={!favouriteActive && activeChannelId === channel.id}
          >
            <Image avatar src={user.avatar} />
            <List.Content>
              <List.Header as="a">
                {" "}
                <span style={{ color: "#ffbf00" }}> # {user.name}</span>
              </List.Header>
              <List.Description>In channel</List.Description>
            </List.Content>
          </List.Item>
        </List>
      ));

  return (
    <Segment clearing>
      <Header fluid="true" as="h3" floated="left" className="messagesHeader">
        <span>
          {displayChannelName()}{" "}
          {!isPrivateChannel && channelStarred && (
            <Icon name={"star"} onClick={unstarChannel} color="yellow"></Icon>
          )}
          {!isPrivateChannel && !channelStarred && (
            <Icon
              name={"star outline"}
              onClick={handleStarred}
              color="yellow"
            ></Icon>
          )}
          {!isPrivateChannel && (
            <Popup
              onOpen={handleEnablePopup}
              onClose={handleDisablePopup}
              open={popupOpen}
              position="bottom center"
              flowing
              hoverable
              trigger={<Button size="mini" icon="question" />}
            >
              <MetaPanel
                key={currentChannel && currentChannel.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                userPosts={userPosts}
                currentUser={currentUser}
                handleDisablePopup={handleDisablePopup}
                handleOpenModal={handleOpenModal}
                loading={loading}
              ></MetaPanel>
            </Popup>
          )}
          {!isPrivateChannel && currentChannel && (
            // currentChannel.id !== "mainChannel" &&
            <Popup
              position="bottom center"
              flowing
              hoverable
              trigger={<Button size="mini" icon="user" />}
            >
              {usersInChannel ? displayUsersInChannel() : ""}

              {isEmpty(usersInChannel) ? (
                <List>
                  <List.Item>
                    <List.Content>
                      <List.Header as="a">
                        {" "}
                        <span style={{ color: "#ffbf00" }}>
                          No users in channel
                        </span>
                      </List.Header>
                    </List.Content>
                  </List.Item>
                </List>
              ) : (
                ""
              )}
            </Popup>
          )}
          {isPrivateChannel && channelFriended && (
            <Icon
              name={"user times"}
              onClick={handleUnfriendPerson}
              color="red"
            ></Icon>
          )}
          {isPrivateChannel && !channelFriended && (
            <Icon
              name={"user plus"}
              onClick={handleAddFriend}
              color="green"
            ></Icon>
          )}
          {"  "}
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            floated="right"
            loading={searchLoading}
            placeholder="Search messages"
            style={{ width: "190px" }}
          ></Input>
        </span>
      </Header>
      <DeleteChannelModal
        handleDeleteChannel={handleDeleteChannel}
        handleCloseModal={handleCloseModal}
        openModal={openModal}
        loading={loading}
      />
    </Segment>
  );
};

export default connect(null, {
  setCurrentChannel,
  setActiveChannelId,
  setPrivateChannel
})(MessagesHeader);
