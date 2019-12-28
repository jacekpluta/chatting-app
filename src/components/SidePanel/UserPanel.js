import React from "react";
import { Grid, Header, Icon } from "semantic-ui-react";

const userStyle = {
  background: "#4c3c4c"
};

const gridRowStyle = {
  padding: "1.2em",
  margin: 0
};
export default function UserPanel() {
  return (
    <Grid style={userStyle}>
      <Grid.Column>
        <Grid.Row style={gridRowStyle}>
          {/* APP HEADER */}
          <Header>
            <Icon name="code"></Icon>
            <Header.Content>Chat</Header.Content>
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
}
