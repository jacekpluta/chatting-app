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
    hideSidbar
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
        style={{ paddingTop: "1em", paddingLeft: "2em", color: "#FFD700" }}
      >
        <Icon name="exchange" />

        <Header.Content>Channels</Header.Content>
      </Header>

      <Divider />
      <Channels
        userPosts={userPosts}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        currentUser={currentUser}
        hideSidbar={hideSidbar}
        favouriteNotActiveChange={favouriteNotActiveChange}
        favouriteActive={favouriteActive}
      />
      <Starred
        hideSidbar={hideSidbar}
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        favouriteActiveChange={favouriteActiveChange}
        favouriteActive={favouriteActive}
      />
    </React.Fragment>
  );
}
