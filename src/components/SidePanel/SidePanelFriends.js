import React, { useState } from "react";

import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Friends from "./Friends";
import { Header, Icon } from "semantic-ui-react";

export default function SidePanelFriends(props) {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    usersList,

    hideSidbar
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
        hideSidbar={hideSidbar}
        friendsMarkActive={friendsMarkActive}
        friendsMarkActiveChange={friendsMarkActiveChange}
      ></Friends>

      <DirectMessages
        hideSidbar={hideSidbar}
        currentUser={currentUser}
        friendsMarkActive={friendsMarkActive}
        friendsNotMarkActiveChange={friendsNotMarkActiveChange}
      ></DirectMessages>
    </React.Fragment>
  );
}
