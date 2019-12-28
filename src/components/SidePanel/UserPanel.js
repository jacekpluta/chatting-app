import React, { useEffect, useState } from "react";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";
import firebase from "../Firebase";

const handleSignout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => console.log("signed out!"));
};

const userStyle = {
  background: "#4c3c4c"
};

const gridRowStyle = {
  padding: "1.2em",
  margin: 0
};

const UserPanel = props => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    setCurrentUser(props.currentUser.displayName);
  }, [props.currentUser.displayName]);

  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{currentUser}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>
    }
  ];
  return (
    <Grid style={userStyle}>
      <Grid.Column>
        <Grid.Row style={gridRowStyle}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>

        {/* User Dropdown  */}
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown
            trigger={<span>Hello, {currentUser}</span>}
            options={dropdownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
