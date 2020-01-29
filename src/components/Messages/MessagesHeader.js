import React from "react";

import { Header, Segment, Input, Icon, Popup, Button } from "semantic-ui-react";
import MetaPanel from "../MetaPanel/MetaPanel";

export default function MessagesHeader(props) {
  const {
    displayChannelName,
    handleSearchChange,
    searchLoading,
    isPrivateChannel,
    handleStarred,
    channelStarred,
    unstarChannel,
    handleAddFriend,
    friendAdded,
    unfriendPerson,
    currentChannel,
    userPosts,
    currentUser
  } = props;

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
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
          )}{" "}
          {!isPrivateChannel && (
            <Popup
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
              ></MetaPanel>
            </Popup>
          )}
          {isPrivateChannel && friendAdded && (
            <Icon
              name={"address card"}
              onClick={unfriendPerson}
              color="green"
            ></Icon>
          )}
          {isPrivateChannel && !friendAdded && (
            <Icon
              name={"address card outline"}
              onClick={handleAddFriend}
              color="green"
            ></Icon>
          )}
        </span>
      </Header>
      <Header floated="right">
        <Input
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          loading={searchLoading}
          placeholder="Search messages"
        ></Input>
      </Header>
    </Segment>
  );
}
