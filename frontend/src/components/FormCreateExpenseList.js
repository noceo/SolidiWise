import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const FormCreateExpenseList = (props) => {
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

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formCreateExpenseListName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" />
        <Form.Text className="text-muted">Choose a name for your new list.</Form.Text>
      </Form.Group>

      <Form.Group controlId="formCreateExpenseListParticipants">
        {participantFields.map((input, index) => {
          return (
            <div key={index} className="mb-3">
              <Form.Label>{index + 1}. Participant</Form.Label>
              <div className="d-flex">
                <Form.Control type="text" className="me-2" placeholder="Enter address" onChange={(event) => handleFormChange(index, event)} value={input} />
                <Button className="btn btn-danger" onClick={() => removeParticipantField(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
          );
        })}
      </Form.Group>
      <Button variant="secondary" onClick={addParticipantField}>
        Add Participant
      </Button>
    </Form>
  );
};

export default FormCreateExpenseList;
