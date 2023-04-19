import { React, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NumericInput from "react-numeric-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CustomModal = (props) => {
  const [participantFields, setParticipantFields] = useState([]);

  const handleFormChange = (index, event) => {
    let data = [...participantFields];
    data[index] = event.target.value;
    setParticipantFields(data);
    console.log(data);
  };

  const addParticipantField = () => {
    let data = [...participantFields, ""];
    setParticipantFields(data);
    console.log(data);
  };

  const removeParticipantField = (index) => {
    let data = [...participantFields];
    data.splice(index, 1);
    setParticipantFields(data);
    console.log(data);
  };

  const dollarFormat = (number) => {
    return number + "$";
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.headerText}</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formCreateExpenseName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter name" />
            <Form.Text className="text-muted">Choose a name for your new expense.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCreateExpenseAmount">
            <Form.Label>Amount</Form.Label>
            <NumericInput className="form-control" name="amount" type="number" placeholder="Enter an amount" precision={2} step={0.1} min={0} format={dollarFormat} style={false} />
            <Form.Text className="text-muted">Enter the amount of the expense.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCreateExpenseSpender">
            <Form.Label>Spender</Form.Label>
            <Form.Select name="spender">
              <option>Select spender</option>
              <option value={props.expenseGroup.owner}>{props.expenseGroup.owner}</option>
              {props.expenseGroup.participants.map((participant, index) => {
                return (
                  <option key={index} value={participant}>
                    {participant}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formCreateExpenseDebtors">
            {participantFields.map((input, index) => {
              return (
                <div key={index} className="mb-3">
                  <Form.Label>{index + 1}. Debtor</Form.Label>
                  <div className="d-flex">
                    <Form.Select className="me-3" name="debtors">
                      <option>Select debtor</option>
                      <option value={props.expenseGroup.owner}>{props.expenseGroup.owner}</option>
                      {props.expenseGroup.participants.map((participant, index) => {
                        return (
                          <option key={index} value={participant}>
                            {participant}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Button className="btn btn-danger" onClick={() => removeParticipantField(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </Form.Group>
          <Button variant="secondary" onClick={addParticipantField}>
            Add Debtor
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={props.onSubmit}>
            {props.submitText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CustomModal;
