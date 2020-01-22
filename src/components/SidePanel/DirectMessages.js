import React, { useState, useEffect } from "react";
import firebase from "./../Firebase";
import { Menu, Icon, Image, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList
} from "../../actions";

const DirectMessages = props => {
  const { currentUser } = props;

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));

  useEffect(() => {
    if (currentUser) {
      addListeners(
        currentUser.uid,
        currentUser.displayName,
        currentUser.photoURL
      );
    }
    return () => {
      connectedRef.off();
      presenceRef.off();
    };
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
        if (currentUser.uid !== snapshot.key) {
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

  const [usersNew, setUsersNew] = useState([]);

  const filterUserList = () => {
    const usersFiletered = users.filter(
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
    setUsersNew(usersFiletered);
  };

  useEffect(() => {
    if (users) {
      filterUserList();
    }
    props.setUsersList(usersNew);
  }, [users]);

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
      status: user.status,
      photoURL: user.photoURL
    };
    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
  };

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUser.uid}`
      : `${currentUser.uid}/${userId}`;
  };

  //SEARCH BAR
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchMessages();
    } else {
      setSearchResult([]);
    }
  }, [searchTerm]);

  //USERS SEARCH
  const handleSearchMessages = () => {
    const allUsers = [...usersNew];

    const regex = new RegExp(searchTerm, "gi");
    const searchResults = allUsers.reduce((acc, user) => {
      if (user.name && user.name.match(regex)) {
        acc.push(user);
      }
      return acc;
    }, []);

    setSearchResult(searchResults);
    setTimeout(() => {
      setSearchLoading(false);
    }, 1000);
  };

  return (
    <div>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail"></Icon>
          </span>
          SEARCH USERS ({searchResult !== undefined && searchResult.length})
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            loading={searchLoading}
            placeholder="Search users"
          ></Input>
        </Menu.Item>
        {searchResult
          ? searchResult.map(user => (
              <Menu.Item
                key={user.uid}
                style={{ opacity: 0.7 }}
                onClick={() => changeChannel(user)}
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
            ))
          : ""}
      </Menu.Menu>
    </div>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList
})(DirectMessages);
