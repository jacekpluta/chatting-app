import React, { useState, useEffect } from "react";
import firebase from "./../Firebase";
import { Menu, Icon, Image } from "semantic-ui-react";

export default function DirectMessages(props) {
  const { currentUser } = props;
  const [usersRef] = useState(firebase.database().ref("users"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [users, setUsers] = useState([]);

  const [presenceRef] = useState(firebase.database().ref("presence"));

  useEffect(() => {
    if (currentUser) {
      addListeners(
        currentUser.uid,
        currentUser.displayName,
        currentUser.photoURL
      );
    }
    return () => {};
  }, []);

  const addListeners = (
    currentUserUid,
    currrentUserName,
    currentUserPhotoURL
  ) => {
    connectedRef.on("value", snapshot => {
      if (snapshot.val() === true) {
        const userInfoOnline = {
          uid: currentUserUid,
          name: currrentUserName,
          status: true,
          photoURL: currentUserPhotoURL
        };

        const userInfoOffline = {
          uid: currentUserUid,
          name: currrentUserName,
          status: false,
          photoURL: currentUserPhotoURL
        };

        presenceRef.child(currentUserUid).update(userInfoOnline);

        presenceRef
          .child(currentUserUid)
          .onDisconnect()
          .set(userInfoOffline);
      }

      presenceRef.on("child_added", snapshot => {
        if (currentUserUid !== snapshot.key) {
          setUsers(users => [
            ...users,
            {
              uid: snapshot.val().uid,
              name: snapshot.val().name,
              status: snapshot.val().status,
              photoURL: snapshot.val().photoURL
            }
          ]);
        }
      });

      presenceRef.on("child_removed", snapshot => {
        if (currentUserUid !== snapshot.key) {
          setUsers(users => [
            ...users,
            {
              uid: snapshot.val().uid,
              name: snapshot.val().name,
              status: snapshot.val().status,
              photoURL: snapshot.val().photoURL
            }
          ]);
        }
      });
    });
  };

  const usersList = users.filter(
    (ele, ind) =>
      ind ===
      users.findIndex(
        elem =>
          elem.status === ele.status &&
          elem.uid === ele.uid &&
          elem.name === ele.name &&
          elem.photoURL === ele.photoURL
      )
  );

  const changeChannel = user => {
    console.log(user);
    const channel = getChannelId(users.uid);
  };

  const getChannelId = () => {
    const currentUserId = users.uid;
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail"></Icon>
        </span>
        DIRECT MESSAGES ({usersList.length})
      </Menu.Item>
      {usersList.map(user => (
        <Menu.Item
          key={user.uid}
          style={{ opacity: 0.7 }}
          onClick={() => changeChannel(user.uid)}
        >
          <Icon
            name="circle"
            color={user && user.status ? "green" : "red"}
          ></Icon>

          {user ? (
            <Image
              src={user.photoURL}
              style={{ width: "10%", height: "10%" }}
              avatar
            ></Image>
          ) : (
            ""
          )}
          <span>{user.name}</span>
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
}
