import { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";

const RATINGS = [1, 2, 3, 4, 5];
const stars = (n) => "★".repeat(n);

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Count of feedbacks for each star level: { 1: 0, 2: 0, ... }
  const counts = useMemo(() => {
    const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((f) => {
      result[f.rating] += 1;
    });
    return result;
  }, [feedbacks]);

  const resetForm = () => {
    setName("");
    setRating(1);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }

    if (editingId !== null) {
      // Update existing feedback
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === editingId ? { ...f, name: trimmed, rating } : f,
        ),
      );
    } else {
      // Add new feedback
      setFeedbacks((prev) => [
        ...prev,
        { id: Date.now(), name: trimmed, rating },
      ]);
    }
    resetForm();
  };

  const handleEdit = (feedback) => {
    setEditingId(feedback.id);
    setName(feedback.name);
    setRating(feedback.rating);
    setError("");
  };

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    // If the item being edited is deleted, clear the form
    if (editingId === id) resetForm();
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4 app-title">Feedback System</h1>

      {/* Overall Ratings */}
      <Card className="mb-4 app-card">
        <Card.Body>
          <Card.Title as="h4" className="mb-3 card-heading">
            Overall Ratings
          </Card.Title>
          {RATINGS.map((r) => (
            <div key={r} className="d-flex align-items-center mb-2">
              <span className="star-label" style={{ width: 138 }}>
                {stars(r)}
              </span>
              <Badge pill bg="primary">
                {counts[r]}
              </Badge>
            </div>
          ))}
          <hr />
          <div>
            Total feedbacks: <strong>{feedbacks.length}</strong>
          </div>
        </Card.Body>
      </Card>

      {/* Feedback Form */}
      <Card className="mb-4 app-card">
        <Card.Body>
          <Card.Title as="h4" className="mb-3 card-heading">
            Feedback Form
          </Card.Title>
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="align-items-end g-3">
              <Col md={5}>
                <Form.Group controlId="feedback-name">
                  <Form.Label>Enter Your Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    isInvalid={!!error}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="feedback-rating">
                  <Form.Label>Choose Rating:</Form.Label>
                  <Form.Select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {RATINGS.map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md="auto" className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  {editingId !== null ? "UPDATE" : "SUBMIT"}
                </Button>
                {editingId !== null && (
                  <Button variant="outline-secondary" onClick={resetForm}>
                    CANCEL
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* All Feedbacks */}
      <Card className="app-card">
        <Card.Body>
          <Card.Title as="h4" className="mb-3 card-heading">
            ALL FEEDBACKS
          </Card.Title>

          {feedbacks.length === 0 ? (
            <p className="text-muted mb-0">No feedback submitted yet.</p>
          ) : (
            <ListGroup variant="flush">
              {feedbacks.map((f) => (
                <ListGroup.Item
                  key={f.id}
                  active={f.id === editingId}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <strong className="me-3">{f.name}</strong>
                    <span className="star-label">{stars(f.rating)}</span>
                    <span className="ms-2">({f.rating})</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleEdit(f)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(f.id)}
                    >
                      DELETE
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
