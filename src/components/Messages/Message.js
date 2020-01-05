import React, { useState, useEffect } from "react";
import { Comment } from "semantic-ui-react";
import moment from "moment";

export default function Message(props) {
  const { message, messagesRef, currentUser } = props;
  const [isMyMessage, setIsMyMessage] = useState(false);

  useEffect(() => {
    isOwnMessage();
    return () => {};
  });

  const isOwnMessage = () => {
    if (message.currentUser.id === currentUser.uid) {
      setIsMyMessage(true);
    }
  };

  const timeFromNow = timeStamp => moment(timeStamp).fromNow();

  return (
    <Comment>
      <Comment.Avatar src={message.currentUser.avatar} />
      <Comment.Content className={isMyMessage ? "MyMessage" : ""}>
        <Comment.Author as="a">{message.currentUser.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timeStamp)}</Comment.Metadata>
        <Comment.Text>{message.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}
