import React, { useState } from "react";
import { Header, Icon, Divider } from "semantic-ui-react";
import Channels from "./Channels";
import Starred from "./Starred";

export default function SidePanelChannels(props) {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    hideSidbar,
    activeChannelId
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
      <Header
        inverted
        as="h2"
        style={{ paddingLeft: "10px", paddingTop: "30px", color: "#ffbf00" }}
      >
        <Icon name="comments" />

        <Header.Content>Channels</Header.Content>
      </Header>

      <Divider />
      <Starred
        hideSidbar={hideSidbar}
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        favouriteActiveChange={favouriteActiveChange}
        favouriteActive={favouriteActive}
      />
      <Channels
        userPosts={userPosts}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        currentUser={currentUser}
        hideSidbar={hideSidbar}
        favouriteNotActiveChange={favouriteNotActiveChange}
        favouriteActive={favouriteActive}
        activeChannelId={activeChannelId}
      />
    </React.Fragment>
  );
}
