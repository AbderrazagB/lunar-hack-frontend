import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import UniversalNavbar from '../navbar/UniversalNavbar';
import '../../styles/lost-and-found.scss';

const LostAndFound = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    contact: ''
  });

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockItems = [
      {
        id: 1,
        name: 'Clé USB',
        description: 'Clé USB noire de 32GB',
        location: 'Salle 101',
        date: '2024-03-15',
        contact: 'etudiant@universite.fr'
      },
      {
        id: 2,
        name: 'Lunettes',
        description: 'Lunettes de vue avec monture noire',
        location: 'Bibliothèque',
        date: '2024-03-14',
        contact: 'etudiant2@universite.fr'
      }
    ];
    setItems(mockItems);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new item to the list
    setItems([...items, { ...newItem, id: items.length + 1 }]);
    setShowModal(false);
    setNewItem({
      name: '',
      description: '',
      location: '',
      date: '',
      contact: ''
    });
  };

  return (
    <div className="lost-and-found-page">
      <UniversalNavbar />
      
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center mb-4">Objets Trouvés</h1>
            <div className="text-center">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Signaler un Objet Trouvé
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          {items.map(item => (
            <Col md={6} lg={4} key={item.id} className="mb-4">
              <Card className="item-card">
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {item.description}<br />
                    <strong>Lieu:</strong> {item.location}<br />
                    <strong>Date:</strong> {item.date}<br />
                    <strong>Contact:</strong> {item.contact}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Signaler un Objet Trouvé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom de l'objet</Form.Label>
              <Form.Control
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lieu</Form.Label>
              <Form.Control
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newItem.date}
                onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="email"
                value={newItem.contact}
                onChange={(e) => setNewItem({...newItem, contact: e.target.value})}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Soumettre
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LostAndFound; 