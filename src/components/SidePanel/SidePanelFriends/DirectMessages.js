import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import { Menu, Icon, Image, Input, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList,
  setActiveChannelId
} from "../../../actions";

const DirectMessages = props => {
  const {
    currentUser,
    hideSidbar,
    privateActiveChannelId,
    friendsMarkActive
  } = props;

  const [usersOnline, setUsersOnline] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));

  useEffect(() => {
    onlineUsersListener();
    userConnectedListener(
      currentUser.uid,
      currentUser.displayName,
      currentUser.photoURL
    );

    // const interval = setInterval(() => {
    //   onlineUsersListener();
    //   userConnectedListener(
    //     currentUser.uid,
    //     currentUser.displayName,
    //     currentUser.photoURL
    //   );

    //   return () => {
    //     connectedRef.off();
    //     presenceRef.off();
    //   };
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // const seen = new Set();
    // const filteredArr = usersOnline.filter(el => {
    //   const duplicate = seen.has(el.id);
    //   seen.add(el.id);
    //   return !duplicate;
    // });

    // console.log(filteredArr);
    props.setUsersList(usersOnline);
  }, [usersOnline]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const userConnectedListener = (
    currentUserUid,
    currrentUserName,
    currentUserPhotoURL
  ) => {
    connectedRef.on("value", snapshot => {
      if (snapshot.val() === true) {
        const userInfoOnline = {
          id: currentUserUid,
          name: currrentUserName,
          status: true,
          photoURL: currentUserPhotoURL
        };

        const userInfoOffline = {
          id: currentUserUid,
          name: currrentUserName,
          status: false,
          photoURL: currentUserPhotoURL
        };

        presenceRef.child(currentUserUid).update(userInfoOnline);

        presenceRef
          .child(currentUserUid)
          .onDisconnect()
          .update(userInfoOffline);
      }
    });
  };
  const [userStatusToChange, setUserStatusToChange] = useState(null);

  const onlineUsersListener = () => {
    presenceRef.on("child_added", snapshot => {
      if (currentUser.uid !== snapshot.key) {
        setUsersOnline(friendedChannels => [
          ...friendedChannels,
          snapshot.val()
        ]);
      }
    });

    presenceRef.on("child_changed", snapshot => {
      if (currentUser.uid !== snapshot.key) {
        setUserStatusToChange(snapshot.key);
      }
    });
  };

  useEffect(() => {
    if (userStatusToChange) {
      const filteredUsers = usersOnline.filter(userOnline => {
        if (userOnline && userOnline.id !== userStatusToChange) {
          return userOnline;
        }
        if (userOnline && userOnline.id === userStatusToChange) {
          presenceRef
            .child(userStatusToChange)
            .once("value")
            .then(data => {
              if (data.val() !== null) {
                setUsersOnline(friendedChannels => [
                  ...friendedChannels,
                  data.val()
                ]);
              }
            });
        }
      });

      setUsersOnline(filteredUsers);
      setUserStatusToChange(null);
    }
  }, [userStatusToChange]);

  const changeChannel = user => {
    const channelId = getChannelId(user.id);

    const channelData = {
      id: channelId,
      name: user.name,
      status: user.status,
      photoURL: user.photoURL
    };

    props.setActiveChannelId(user.id);
    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
    hideSidbar();
  };

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
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
    const allUsers = [...usersOnline];

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
    }, 300);
  };

  return (
    <div>
      <React.Fragment>
        <Menu.Item>
          <span style={{ color: "#39ff14" }}>
            <Icon name="search"></Icon>
            SEARCH USERS ({searchResult !== undefined &&
              searchResult.length}){" "}
          </span>
        </Menu.Item>
        <Menu.Item>
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            loading={searchLoading}
            placeholder="SEARCH USERS"
          ></Input>
        </Menu.Item>
        {searchResult
          ? searchResult.map(user => (
              <Menu.Item
                key={user.id}
                style={{ opacity: 0.7 }}
                onClick={() => changeChannel(user)}
                active={friendsMarkActive && privateActiveChannelId === user.id}
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
                <span style={{ color: "#39ff14" }}>{user.name}</span>
              </Menu.Item>
            ))
          : ""}
        <Divider clearing />
      </React.Fragment>
    </div>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList,
  setActiveChannelId
})(DirectMessages);
