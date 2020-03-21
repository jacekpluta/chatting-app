import React, { useState } from "react";

import Channels from "./Channels";

export default function SidePanelChannels(props) {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    hideSidebar,
    activeChannelId,
    usersInChannel,
    searchTerm,
    favChannels
  } = props;

  const [favouriteActive, setFavouriteActive] = useState(false);

  const favouriteActiveChange = () => {
    setFavouriteActive(true);
  };

  const favouriteNotActiveChange = () => {
    setFavouriteActive(false);
  };

  return (
    <React.Fragment>
      <Channels
        userPosts={userPosts}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        currentUser={currentUser}
        hideSidebar={hideSidebar}
        favouriteNotActiveChange={favouriteNotActiveChange}
        favouriteActive={favouriteActive}
        activeChannelId={activeChannelId}
        usersInChannel={usersInChannel}
        favouriteActiveChange={favouriteActiveChange}
        searchTerm={searchTerm}
        favChannels={favChannels}
      />
    </React.Fragment>
  );
}
