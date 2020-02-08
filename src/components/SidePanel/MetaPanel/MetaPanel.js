import React, { useState } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
  ListContent,
  Button
} from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../../actions";

const MetaPanel = props => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    isPrivateChannel,
    currentChannel,
    userPosts,
    currentUser,
    handleOpenModal
  } = props;

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
      ));

  if (isPrivateChannel) return null;

  return (
    <Segment loading={!currentChannel} style={{ width: "250px" }}>
      <Header as="h3" attached="top">
        {"About "} {"#"}
        {currentChannel && currentChannel.name}
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
            {userPosts && currentChannel ? displayTopPoster(userPosts) : "none"}
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

        {!isPrivateChannel &&
          currentChannel &&
          currentChannel.createdBy.uid === currentUser.uid && (
            <React.Fragment>
              <Accordion.Title
                active={activeIndex === 3}
                index={3}
                onClick={setActive}
              >
                <Icon name="dropdown" />
                <Icon name="x" />
                Delete channel?
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 3}>
                <Header as="h3">
                  <Button
                    name={"x"}
                    onClick={() => {
                      handleOpenModal(true);
                    }}
                    color="red"
                  >
                    Delete Channel
                  </Button>
                </Header>
              </Accordion.Content>
            </React.Fragment>
          )}
      </Accordion>
    </Segment>
  );
};

export default connect(null, { setCurrentChannel })(MetaPanel);
