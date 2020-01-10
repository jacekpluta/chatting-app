import React, { useState } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

const Starred = props => {
  const [starredChannels, setStarredChannels] = useState([]);

  const changeChannel = channel => {
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
  };

  const displayChannels = starredChannels => {
    return starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
      >
        # {channel.name}
      </Menu.Item>
    ));
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star"></Icon> STARRED
        </span>
        {starredChannels.lenght}
      </Menu.Item>

      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
