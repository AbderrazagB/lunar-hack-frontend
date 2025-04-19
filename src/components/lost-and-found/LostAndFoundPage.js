import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaPlus } from 'react-icons/fa';
import UniversalNavbar from '../navbar/UniversalNavbar';
import '../../styles/lost-and-found.scss';

const LostAndFoundPage = () => {
  const [activeTab, setActiveTab] = useState('lost');

  // Sample data for demonstration
  const lostItems = [
    { id: 1, name: 'Laptop', description: 'MacBook Pro 13" with a blue case', location: 'Library', date: '2023-04-15', status: 'Open' },
    { id: 2, name: 'Phone', description: 'iPhone 13 with a black case', location: 'Cafeteria', date: '2023-04-14', status: 'Open' },
    { id: 3, name: 'Backpack', description: 'Nike black backpack with laptop compartment', location: 'Student Center', date: '2023-04-13', status: 'Closed' }
  ];

  const foundItems = [
    { id: 1, name: 'Water Bottle', description: 'Hydro Flask 32oz in blue', location: 'Gym', date: '2023-04-16', status: 'Open' },
    { id: 2, name: 'Keys', description: 'Car keys with university keychain', location: 'Parking Lot', date: '2023-04-15', status: 'Open' },
    { id: 3, name: 'Wallet', description: 'Brown leather wallet with student ID', location: 'Science Building', date: '2023-04-14', status: 'Closed' }
  ];

  return (
    <div className="lost-and-found-page">
      <UniversalNavbar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="lost-found-card">
              <Card.Header className="bg-primary text-white">
                <h2 className="mb-0"><FaSearch className="me-2" /> Lost & Found</h2>
              </Card.Header>
              <Card.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                >
                  <Tab eventKey="lost" title="Lost Items">
                    <div className="d-flex justify-content-end mb-3">
                      <Button variant="primary" className="add-item-button">
                        <FaPlus className="me-2" /> Report Lost Item
                      </Button>
                    </div>
                    <div className="items-list">
                      {lostItems.map(item => (
                        <Card key={item.id} className="item-card mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="mb-1">{item.name}</h5>
                                <p className="mb-1 text-muted">{item.description}</p>
                                <small className="text-muted">
                                  <strong>Location:</strong> {item.location} | 
                                  <strong> Date:</strong> {item.date}
                                </small>
                              </div>
                              <div>
                                <span className={`status-badge ${item.status.toLowerCase()}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>
                  <Tab eventKey="found" title="Found Items">
                    <div className="d-flex justify-content-end mb-3">
                      <Button variant="primary" className="add-item-button">
                        <FaPlus className="me-2" /> Report Found Item
                      </Button>
                    </div>
                    <div className="items-list">
                      {foundItems.map(item => (
                        <Card key={item.id} className="item-card mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="mb-1">{item.name}</h5>
                                <p className="mb-1 text-muted">{item.description}</p>
                                <small className="text-muted">
                                  <strong>Location:</strong> {item.location} | 
                                  <strong> Date:</strong> {item.date}
                                </small>
                              </div>
                              <div>
                                <span className={`status-badge ${item.status.toLowerCase()}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LostAndFoundPage; 