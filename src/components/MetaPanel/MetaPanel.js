import React, { useState, useEffect } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
  ListContent
} from "semantic-ui-react";
import { connect } from "react-redux";

const MetaPanel = props => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isPrivateChannel, currentChannel, userPosts, messagesBool } = props;

  const setActive = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const displayTopPoster = posts =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <ListContent>
            <List.Header>{key}</List.Header>
            <List.Description>{val.count}</List.Description>
          </ListContent>
        </List.Item>
      ))
      .slice(0, 5);

  if (isPrivateChannel) return null;

  return (
    <Segment loading={!currentChannel}>
      <Header as="h3" attached="top">
        {"About #"} {currentChannel && currentChannel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={setActive}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {currentChannel && currentChannel.details}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={setActive}
        >
          <Icon name="dropdown" />
          <Icon name="circle" />
          Top posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>
            {userPosts && currentChannel && messagesBool
              ? displayTopPoster(userPosts)
              : "none"}
          </List>
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={setActive}
        >
          <Icon name="dropdown" />
          <Icon name="pencil" />
          Created by
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3">
            <Image
              circular
              src={currentChannel && currentChannel.createdBy.avatar}
            ></Image>
            {currentChannel && currentChannel.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default connect(null)(MetaPanel);
