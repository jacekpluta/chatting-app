import React, { useState } from "react";

import UserPanel from "../SidePanelUser/UserPanel";
import DirectMessages from "./DirectMessages";
import Friends from "./Friends";
import { Header, Icon } from "semantic-ui-react";

export default function SidePanelFriends(props) {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    usersList,
    privateActiveChannelId,
    hideSidebar,
    darkMode,
    turnOnTutorial
  } = props;

  const [friendsMarkActive, setfriendsMarkActive] = useState(false);

  const friendsMarkActiveChange = () => {
    setfriendsMarkActive(true);
  };

  const friendsNotMarkActiveChange = () => {
    setfriendsMarkActive(false);
  };

  return (
    <React.Fragment>
      <UserPanel
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
        darkMode={darkMode}
        turnOnTutorial={turnOnTutorial}
      ></UserPanel>

      <Header
        inverted
        as="h2"
        style={{ paddingLeft: "10px", color: "#39ff14" }}
      >
        <Icon name="users" />

        <Header.Content>Friends</Header.Content>
      </Header>

      <Friends
        currentChannel={currentChannel}
        currentUser={currentUser}
        usersList={usersList}
        isPrivateChannel={isPrivateChannel}
        hideSidebar={hideSidebar}
        friendsMarkActive={friendsMarkActive}
        friendsMarkActiveChange={friendsMarkActiveChange}
        privateActiveChannelId={privateActiveChannelId}
      ></Friends>

      <DirectMessages
        hideSidebar={hideSidebar}
        currentUser={currentUser}
        friendsMarkActive={friendsMarkActive}
        friendsNotMarkActiveChange={friendsNotMarkActiveChange}
        privateActiveChannelId={privateActiveChannelId}
        currentChannel={currentChannel}
      ></DirectMessages>
    </React.Fragment>
  );
}
