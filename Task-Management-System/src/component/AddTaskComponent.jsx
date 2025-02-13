import { useState } from "react";
import { createTask} from "../service/TaskApiService";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { getLoggedInUserId } from "../service/AuthApiService";

const AddTaskComponent = () => {
  const [task, setTask] = useState("");
  const [completed, setCompleted] = useState(false);
  const [taskCreatedAt, ] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ task: "" });
  const userId = getLoggedInUserId();

  const saveTask = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const taskObj = {
      task,
      completed,
      taskCreatedAt,
      updatedAt: new Date().toISOString(),
      userId,
    };

    try {
      
        await createTask(taskObj);
      
      navigate("/tasks");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { task: "" };

    if (!task.trim()) {
      errorsCopy.task = "Task field is required";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow rounded-lg">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaTasks className="mr-3 text-primary" size={32} />
                  <h2 className="m-0">{id ? "Update" : "Add"} Task</h2>
                </div>
                <Form onSubmit={saveTask}>
                  <Form.Group controlId="formTask">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter task description"
                      value={task}
                      onChange={(event) => setTask(event.target.value)}
                      isInvalid={!!errors.task}
                      className="rounded-lg"
                    />
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.task}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formCompleted" className="mt-3">
                    <Form.Check
                      type="checkbox"
                      label="Mark as Completed"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3 w-100 rounded-pill"
                  >
                    {id ? "Update" : "Add"} Task
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddTaskComponent;
