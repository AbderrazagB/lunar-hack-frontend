import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaSearch, FaCloudUploadAlt, FaExchangeAlt } from 'react-icons/fa';
import UniversalNavbar from '../navbar/UniversalNavbar';
import axios from 'axios';
import '../../styles/lost-and-found.scss';

const LostAndFoundPage = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [formData, setFormData] = useState({
    description: '',
    email: '',
    image: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFiles(file);
    }
  };

  const handleFiles = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Revoke the old preview URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFormData(prev => ({ ...prev, image: file }));
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, variant: '', message: '' });

    const formDataToSend = new FormData();
    formDataToSend.append('description', formData.description);
    formDataToSend.append('email', formData.email);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const endpoint = activeTab === 'lost' ? '/report/lost' : '/report/found';
      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAlert({
        show: true,
        variant: 'success',
        message: `Item successfully reported as ${activeTab}!`
      });
      
      // Clean up old preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setFormData({ description: '', email: '', image: null });
      setPreviewUrl(null);
    } catch (error) {
      setAlert({
        show: true,
        variant: 'danger',
        message: error.response?.data?.detail || 'An error occurred while submitting the form.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFiles(file);
    }
  };

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const renderForm = () => (
    <Form onSubmit={handleSubmit} className="report-form">
      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          placeholder="Please provide a detailed description of the item"
          className="form-control-lg"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="Enter your email address"
          className="form-control-lg"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <div
          className={`drag-drop-zone ${dragActive ? 'drag-active' : ''} ${previewUrl ? 'has-image' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="upload-label">
            {previewUrl ? (
              <>
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
                <div className="change-image">
                  <FaExchangeAlt size={20} />
                  <p>Click or drag to change image</p>
                </div>
              </>
            ) : (
              <>
                <FaCloudUploadAlt size={40} />
                <p>Drag and drop your image here or click to select</p>
              </>
            )}
          </label>
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
          size="lg"
          className="submit-button"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </Form>
  );

  return (
    <div className="lost-and-found-page">
      <UniversalNavbar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="form-card">
              <Card.Header>
                <h2 className="mb-0"><FaSearch className="me-2" /> Lost & Found</h2>
              </Card.Header>
              <Card.Body className="p-4">
                {alert.show && (
                  <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                  </Alert>
                )}
                
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => {
                    setActiveTab(k);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setFormData({ description: '', email: '', image: null });
                    setPreviewUrl(null);
                    setAlert({ show: false });
                  }}
                  className="mb-4 custom-tabs"
                >
                  <Tab eventKey="lost" title="Report Lost Item">
                    {renderForm()}
                  </Tab>
                  <Tab eventKey="found" title="Report Found Item">
                    {renderForm()}
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