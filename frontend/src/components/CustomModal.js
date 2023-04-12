import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CustomModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onClose}>
          {props.submitText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
