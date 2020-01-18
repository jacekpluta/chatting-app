import React, { useState, useEffect } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";
import { Loader } from "semantic-ui-react";

export default function Message(props) {
  const { message, currentUser, messageImageLoading, biggerText } = props;
  const [isMyMessage, setIsMyMessage] = useState(false);

  useEffect(() => {
    isOwnMessage();
    return () => {};
  });

  const isImage = () => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  const isOwnMessage = () => {
    if (message.currentUser.id === currentUser.uid) {
      setIsMyMessage(true);
    }
  };

  const biggerTextStyle = {
    fontSize: "1.8em"
  };

  const normalTextStyle = {
    fontSize: "1.0 em"
  };

  const timeFromNow = timeStamp => moment(timeStamp).fromNow();
  if (messageImageLoading) {
    return (
      <Loader
        size="medium"
        active={messageImageLoading}
        content="Loading"
      ></Loader>
    );
  } else {
    return (
      <Comment
        style={biggerText ? biggerTextStyle : normalTextStyle}
        className="message"
      >
        <Comment.Avatar src={message.currentUser.avatar} />
        <Comment.Content className={isMyMessage ? "MyMessage" : ""}>
          <Comment.Author as="a">{message.currentUser.name}</Comment.Author>
          <Comment.Metadata>{timeFromNow(message.timeStamp)}</Comment.Metadata>:
          {isImage() ? (
            <Image src={message.image} className="messageImage"></Image>
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    );
  }
}
