import React, { useState } from "react";

import DirectMessages from "./DirectMessages";
import Friends from "./Friends";

export default function SidePanelFriends(props) {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    usersList,
    activeChannelId,
    hideSidebar,
    searchTerm
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
      <Friends
        currentChannel={currentChannel}
        currentUser={currentUser}
        usersList={usersList}
        isPrivateChannel={isPrivateChannel}
        hideSidebar={hideSidebar}
        friendsMarkActive={friendsMarkActive}
        friendsMarkActiveChange={friendsMarkActiveChange}
        activeChannelId={activeChannelId}
      ></Friends>

      <DirectMessages
        hideSidebar={hideSidebar}
        currentUser={currentUser}
        friendsMarkActive={friendsMarkActive}
        friendsNotMarkActiveChange={friendsNotMarkActiveChange}
        activeChannelId={activeChannelId}
        currentChannel={currentChannel}
        searchTerm={searchTerm}
      ></DirectMessages>
    </React.Fragment>
  );
}
