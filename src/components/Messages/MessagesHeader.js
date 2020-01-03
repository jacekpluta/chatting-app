import React from "react";

import { Header, Segment, Input, Icon } from "semantic-ui-react";

export default function MessagesHeader() {
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          Channel
          <Icon name="chess rock" color="black"></Icon>
        </span>
        <Header.Subheader>2 Users</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search messages"
        ></Input>
      </Header>
    </Segment>
  );
}
