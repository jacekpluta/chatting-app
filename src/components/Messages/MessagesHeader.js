import React from "react";

import { Header, Segment, Input, Icon } from "semantic-ui-react";

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
    unfriendPerson
  } = props;

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {displayChannelName()}

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

          {isPrivateChannel && friendAdded && (
            <Icon name={"star"} onClick={unfriendPerson} color="red"></Icon>
          )}

          {isPrivateChannel && !friendAdded && (
            <Icon
              name={"star outline"}
              onClick={handleAddFriend}
              color="red"
            ></Icon>
          )}
        </span>
        <Header.Subheader></Header.Subheader>
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
