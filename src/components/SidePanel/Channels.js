import React, { useState } from "react";
import { Menu, Icon, Modal, Button } from "semantic-ui-react";

const handleAddChannel = () => {};
export default function Channels() {
  const menuStyle = { paddingBottm: "2em" };
  const [stateChannels, setStateChannels] = useState({
    channels: []
  });
  const [modal, setModal] = useState({
    modal: false
  });

  const handleCloseModal = () => {
    setModal(false);
  };

  return (
    <div>
      <Menu.Menu style={menuStyle}>
        <Menu.Item>
          <span>
            <Icon name="exchange"></Icon> CHANNELS
          </span>
          {"  "}({stateChannels.channels.lenght}){" "}
          <Icon onClick={handleAddChannel} name="add"></Icon>
        </Menu.Item>
      </Menu.Menu>

      <Modal
        trigger={<Button>Basic Modal</Button>}
        onClose={handleCloseModal}
        basic
        size="small"
      >
        <Modal.Content>
          <p>
            Your inbox is getting full, would you like us to enable automatic
            archiving of old messages?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted>
            <Icon name="remove" /> No
          </Button>
          <Button color="green" inverted>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
