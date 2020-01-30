import React from "react";

import {
  Header,
  Segment,
  Input,
  Icon,
  Popup,
  Button,
  Divider
} from "semantic-ui-react";
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
        <Header.Content>
          {" "}
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
                trigger={
                  <Button
                    size="mini"
                    icon="question"
                    style={{ paddingTop: "15px", paddingLeft: "-15px" }}
                  />
                }
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
                name={"user times"}
                onClick={unfriendPerson}
                color="red"
              ></Icon>
            )}
            {isPrivateChannel && !friendAdded && (
              <Icon
                name={"user plus"}
                onClick={handleAddFriend}
                color="green"
              ></Icon>
            )}
          </span>
        </Header.Content>
        {"    "}
        <Header.Content>
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            floated="right"
            loading={searchLoading}
            placeholder="Search messages"
            style={{ width: "190px" }}
          ></Input>
        </Header.Content>
      </Header>
    </Segment>
  );
}
