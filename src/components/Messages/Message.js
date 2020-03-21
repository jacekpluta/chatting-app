import React, { useState, useEffect } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";
import FsLightbox from "fslightbox-react";
import {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId
} from "../../actions";
import { connect } from "react-redux";

const Message = props => {
  const { message, currentUser } = props;

  const timeFromNow = timeStamp => moment(timeStamp).fromNow();

  const [isMyMessage, setIsMyMessage] = useState(false);
  const [toggler, setToggler] = useState(false);

  useEffect(() => {
    isOwnMessage();
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

  const style = {
    image: {
      width: "250px",
      height: "250px"
    }
  };

  const changeChannel = user => {
    const channelId = getChannelId(user.id);

    const channelData = {
      id: channelId,
      name: user.name,
      status: null,
      photoURL: user.avatar
    };

    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
    props.setActiveChannelId(user.id);

    //friendsNotMarkActiveChange();
  };

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  return (
    <Comment className="message">
      <Comment.Avatar src={message.currentUser.avatar} />
      <Comment.Content className={isMyMessage ? "myMessage" : ""}>
        {currentUser.uid !== message.currentUser.id ? (
          <Comment.Author
            as="a"
            onClick={() => {
              changeChannel(message.currentUser);
            }}
          >
            {message.currentUser.name}
          </Comment.Author>
        ) : (
          <Comment.Author as="a">{message.currentUser.name}</Comment.Author>
        )}
        <Comment.Metadata>{timeFromNow(message.timeStamp)}</Comment.Metadata>
        {isImage() ? (
          <FsLightbox
            initialAnimation="scale-in-long"
            slideChangeAnimation="scale-in"
            toggler={toggler}
            customSources={[
              <img
                src={message.image}
                alt={"lightbox"}
                style={style.imageLightbox}
              />
            ]}
          />
        ) : (
          ""
        )}
        {isImage() ? (
          <Image
            src={message.image}
            style={style.image}
            onClick={() => setToggler(!toggler)}
          />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId
})(Message);
