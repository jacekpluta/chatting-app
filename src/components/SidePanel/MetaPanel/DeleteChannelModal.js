import React from "react";
import { Button, Header, Modal } from "semantic-ui-react";

const DeleteChannelModal = props => {
  const {
    handleDeleteChannel,
    closeModal,
    openModal,
    handleCloseModal,
    loading
  } = props;

  return (
    <Modal
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={closeModal}
      open={openModal}
    >
      <Header icon="chat" content="Delete Channel" />
      <Modal.Content>
        <p>Are you sure you want to delete that channel?</p>
      </Modal.Content>

      <Modal.Actions>
        <Button
          disabled={loading}
          onClick={handleCloseModal}
          className={"cancel"}
          color="red"
        >
          No
        </Button>
        <Button
          disabled={loading}
          onClick={handleDeleteChannel}
          className={loading ? "checkmark" : ""}
          color="green"
        >
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default DeleteChannelModal;
