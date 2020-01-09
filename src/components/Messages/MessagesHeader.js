import React from "react";

import { Header, Segment, Input, Icon } from "semantic-ui-react";

export default function MessagesHeader(props) {
  const {
    displayChannelName,
    handleSearchChange,
    searchLoading,
    isPrivateChannel
  } = props;

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {displayChannelName()}
          {!isPrivateChannel && <Icon name="chess rock" color="black"></Icon>}
          {isPrivateChannel && <Icon name="star" color="black"></Icon>}
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
