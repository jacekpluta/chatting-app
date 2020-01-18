import { Segment, Input, Button } from "semantic-ui-react";
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

  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [file, setFile] = useState(null);
  const [authorized] = useState(["image/jpeg", "image/png"]);
  const [isTyping, setIsTyping] = useState(false);
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);
  const [userTypingName, setUserTypingName] = useState("");

  const [inputRef, setInputFocus] = useFocus();

  const { currentChannel, currentUser, getMessagesRef } = props;

  const handleChange = event => {
    if (event.target.value) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    setMessage(event.target.value);
  };

  const loadCurrentChannel = () => {
    isTypingRef.child(currentChannel.id).on("value", snapshot => {
      if (snapshot.val()) {
        const isUserTyping = snapshot.val().isUserTyping.isTyping;
        const userTypingName = snapshot.val().isUserTyping.user;

        setShowTypingAnimation(isUserTyping);
        setUserTypingName(userTypingName);
        const userTyping = {
          isUserTyping: isUserTyping,
          userTypingName: userTypingName
        };

        props.setUserTyping(userTyping);
      }
    });
  };

  const handlePressEnterToSend = event => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  };

  useEffect(() => {
    const isTypingObj = {
      isUserTyping: {
        isTyping: isTyping,
        user: currentUser.displayName
      }
    };
    if (currentChannel && currentChannel.id) {
      if (isTyping) {
        loadCurrentChannel();
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
          setError("");
          setIsTyping(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
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
    // console.log(getPath());
    const pathToUpload = currentChannel.id;
    const messRef = getMessagesRef();
    const filePath = `${getPath()}/${uuid()}.jpg`;

    setUploadState(true);

    props.setMessageImageLoadingTrue();

    const task = storageRef
      .child(filePath)
      .put(file, metadata)
      .then(snapshot => {
        setUploadTask(task);
        snapshot.ref.getDownloadURL().then(downloadURL => {
          sendFileMessage(downloadURL, messRef, pathToUpload);
        });
      })
      .then(() => {
        props.setMessageImageLoadingFalse();
      })
      .catch(error => {
        setUploadState("error");
        setUploadTask(null);
        console.log(error);
      });
  };

  useEffect(() => {
    if (uploadTask) {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(
        snapshot
      ) {
        var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percent + "% done");
      });

      return () => {
        uploadTask.cancel();
        setUploadTask(null);
      };
    }
  }, []);

  const sendFileMessage = (downloadURL, messRef, pathToUpload) => {
    messRef
      .child(pathToUpload)
      .push()
      .set(createMessage(downloadURL))
      .then(() => {
        setUploadState(true);
      })
      .catch(error => {
        setUploadState(false);
        setUploadTask(null);
        setError(error);
        console.log(error);
      });
  };

  const handleEmojiPicker = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleAddEmoji = emoji => {
    const oldMessage = message;
    const newMessage = colonToUnicode(`${oldMessage} ${emoji.colons}`);
    setMessage(newMessage);
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
          ></Picker>
        ) : (
          ""
        )}
        <Input
          value={message}
          autoFocus
          fluid
          name="message"
          style={{ marginBottom: "0.7 em" }}
          label={<Button icon={"add"} onClick={handleEmojiPicker}></Button>}
          placeholder="Write your message"
          onChange={handleChange}
          className={error.includes("message") ? "error" : ""}
          ref={inputRef}
          onKeyDown={handlePressEnterToSend}
        />

        <Button.Group icon widths="2">
          <Button
            disabled={loading}
            onClick={sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          ></Button>
          <Button
            disabled={props.messageImageLoading}
            onClick={openModal}
            color="teal"
            content="Upload Media"
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
