import React from "react";
import { Input, Button, Icon, Modal, Message } from "semantic-ui-react";
export default function ModalFile(props) {
  const {
    modal,
    closeModal,
    error,
    loading,
    handleChangeFileUpload,
    sendFile
  } = props;
  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header>Select image file</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          onChange={handleChangeFileUpload}
        ></Input>

        {error !== "" && (
          <Message error>
            {" "}
            <h3>Error</h3>
            {error}
          </Message>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={loading}
          className={loading ? "checkmark" : ""}
          color="green"
          onClick={sendFile}
        >
          <Icon name="checkmark"> Send</Icon>
        </Button>
        <Button
          disabled={loading}
          onClick={closeModal}
          className={"cancel"}
          color="red"
        >
          <Icon name="checkmark"> Cancel</Icon>
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
