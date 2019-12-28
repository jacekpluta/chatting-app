import React from "react";
import "../components/App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";

const App = () => (
  <Grid columns="equal" className="app" style={{ background: "eee" }}>
    <ColorPanel />
    <SidePanel />
    <Messages />
    <MetaPanel />
  </Grid>
);

export default App;
