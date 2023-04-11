import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const FormCreateExpenseList = () => {
  const [participantFields, setParticipantFields] = useState([]);

  const handleFormChange = (index, event) => {
    let data = [...participantFields];
    data[index] = event.target.value;
    setParticipantFields(data);
  };

  const addParticipantField = () => {
    let newParticipantField = "";
    setParticipantFields([...participantFields, newParticipantField]);
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formCreateExpenseListName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" />
        <Form.Text className="text-muted">Choose a name for your new list.</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCreateExpenseListParticipants">
        {participantFields.map((input, index) => {
          return (
            <>
              <Form.Label>{index + 1}. Participant</Form.Label>
              <Form.Control type="text" placeholder="Enter address" />
            </>
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
