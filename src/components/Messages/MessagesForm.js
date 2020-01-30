import { Segment, Input, Button, Loader } from "semantic-ui-react";
import React, { useState, useEffect, useRef } from "react";
import firebase from "../Firebase";
import mime from "mime-types";
import ModalFile from "./ModalFile";
import { uuid } from "uuidv4";

import { connect } from "react-redux";
import { setUserTyping } from "../../actions";

import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

//cutom hook to focus after sending an emoji
const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const MessagesForm = props => {
  const [storageRef] = useState(firebase.storage().ref());
  const [isTypingRef] = useState(firebase.database().ref("isTyping"));

  const [input, setInput] = useState("");
  const [message, setMessage] = useState();

  const [loading, setLoading] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);

  const [file, setFile] = useState(null);
  const [authorized] = useState(["image/jpeg", "image/png"]);
  const [isTyping, setIsTyping] = useState(false);

  const [inputRef, setInputFocus] = useFocus();

  const {
    currentChannel,
    currentUser,
    getMessagesRef,
    messageImageLoading,
    messageSendScroll,
    setMessageImageLoadingFalse,
    setMessageImageLoadingTrue
  } = props;

  const handleChange = event => {
    if (event.target.value) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }

    if (!event.target.value.replace(/\s/g, "").length) {
      console.log(
        "string only contains whitespace (ie. spaces, tabs or line breaks)"
      );
    } else {
      setMessage(event.target.value);
    }
  };
  const handlePressEnterToSend = event => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  };
  const loadCurrentChannel = () => {
    isTypingRef.child(currentChannel.id).on("value", snapshot => {
      if (snapshot.val()) {
        const isUserTyping = snapshot.val().isUserTyping.isTyping;
        const userTypingName = snapshot.val().isUserTyping.user;
        const userTypingUid = snapshot.val().isUserTyping.uid;
        const userTypingChannelId = snapshot.val().isUserTyping.channelId;

        const userTyping = {
          isTyping: isUserTyping,
          name: userTypingName,
          uid: userTypingUid,
          channelId: userTypingChannelId
        };

        props.setUserTyping(userTyping);
      } else {
        const isUserTyping = false;
        const userTypingName = currentUser.name;
        const userTypingUid = currentUser.uid;
        const userTypingChannelId = currentChannel.id;

        const userTyping = {
          isTyping: isUserTyping,
          name: userTypingName,
          uid: userTypingUid,
          channelId: userTypingChannelId
        };

        props.setUserTyping(userTyping);
      }
    });
  };

  useEffect(() => {
    if (currentChannel && currentChannel.id) {
      const isTypingObj = {
        isUserTyping: {
          uid: currentUser.uid,
          channelId: currentChannel.id,
          user: currentUser.displayName,
          isTyping: isTyping
        }
      };
      loadCurrentChannel();
      if (isTyping) {
        isTypingRef
          .child(currentChannel.id)
          .update(isTypingObj)
          .catch(error => {
            console.log(error);
            setLoading(false);
            setMessage("");
            setError(error);
          });
      } else {
        isTypingRef
          .child(currentChannel.id)
          .update(isTypingObj)
          .catch(error => {
            console.log(error);
            setLoading(false);
            setMessage("");
            setError(error);
          });
      }
      return () => {
        isTypingRef.off();
      };
    }
  }, [isTyping]);

  const createMessage = (downloadURL = null) => {
    const createMessage = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      currentUser: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    if (downloadURL !== null) {
      createMessage.image = downloadURL;
    } else {
      createMessage.content = message;
    }
    return createMessage;
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      getMessagesRef()
        .child(currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
          setInput("");
          setError("");
          setIsTyping(false);
          setInputFocus();
          messageSendScroll();
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
          setInput("");
          setMessage("");
          setError(error);
        });
    } else {
      setError("Add a message");
    }
  };

  const handleChangeFileUpload = event => {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file && isAuthorized()) {
      const metadata = { conetentType: mime.lookup(file.name) };
      uploadFile(file, metadata);
    } else {
      closeModal();
    }
  };

  const isAuthorized = () => {
    closeModal();
    setFile(null);
    return authorized.includes(mime.lookup(file.name));
  };

  const getPath = () => {
    if (currentUser) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return `chat/public`;
    }
  };

  const uploadFile = (file, metadata) => {
    const pathToUpload = currentChannel.id;
    const messRef = getMessagesRef();
    const filePath = `${getPath()}/${uuid()}.jpg`;

    setMessageImageLoadingTrue();

    storageRef
      .child(filePath)
      .put(file, metadata)
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          sendFileMessage(downloadURL, messRef, pathToUpload);
        });
      })
      .then(() => {
        setMessageImageLoadingFalse();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const sendFileMessage = (downloadURL, messRef, pathToUpload) => {
    messRef
      .child(pathToUpload)
      .push()
      .set(createMessage(downloadURL))
      .catch(error => {
        setError(error);
        console.log(error);
      });
  };

  const handleEmojiPicker = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleAddEmoji = emoji => {
    let oldMessage = "";
    if (message) {
      oldMessage = message;
    } else {
      oldMessage = "";
    }

    const newMessage = colonToUnicode(`${oldMessage} ${emoji.colons}`);
    setMessage(newMessage);
    setInput(newMessage);
    setEmojiPicker(false);
    setInputFocus();
  };

  const colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  return (
    <React.Fragment>
      <Segment className="messageForm">
        {emojiPicker ? (
          <Picker
            set="apple"
            className={emojiPicker}
            title="Pick your emoji"
            emoji={"point_up"}
            onSelect={handleAddEmoji}
            style={{ position: "absolute", bottom: "20px" }}
          ></Picker>
        ) : (
          ""
        )}
        <Input
          value={input}
          onInput={e => setInput(e.target.value)}
          autoFocus
          fluid
          name="message"
          style={{ marginBottom: "0.7 em" }}
          label={
            <Button
              size={"big"}
              icon={"smile outline"}
              onClick={handleEmojiPicker}
            ></Button>
          }
          placeholder="Write your message"
          onChange={handleChange}
          className={error.includes("message") ? "error" : ""}
          ref={inputRef}
          onKeyDown={handlePressEnterToSend}
        />
        {messageImageLoading ? <Loader active></Loader> : ""}
        <Button.Group icon widths="2">
          <Button
            disabled={loading || messageImageLoading}
            onClick={sendMessage}
            color="blue"
            content="Send Message"
            labelPosition="left"
            icon="edit"
          ></Button>
          <Button
            disabled={props.messageImageLoading}
            onClick={openModal}
            color="green"
            content="Upload Image"
            labelPosition="right"
            icon="upload"
          ></Button>
        </Button.Group>
      </Segment>
      <ModalFile
        modal={modal}
        closeModal={closeModal}
        error={error}
        handleChangeFileUpload={handleChangeFileUpload}
        sendFile={sendFile}
      ></ModalFile>
    </React.Fragment>
  );
};

export default connect(null, { setUserTyping })(MessagesForm);
