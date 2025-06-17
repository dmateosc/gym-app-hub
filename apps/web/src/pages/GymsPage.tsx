import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { useGyms } from '../hooks/useGyms';

interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  capacity: number;
  operatingHours: {
    monday: { open: string; close: string; };
    tuesday: { open: string; close: string; };
    wednesday: { open: string; close: string; };
    thursday: { open: string; close: string; };
    friday: { open: string; close: string; };
    saturday: { open: string; close: string; };
    sunday: { open: string; close: string; };
  };
  amenities: string[];
  isActive: boolean;
}

const GymsPage: React.FC = () => {
  const { data: gyms, isLoading, error } = useGyms();
  const [showModal, setShowModal] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const handleShowModal = (gym?: Gym) => {
    setSelectedGym(gym || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGym(null);
  };

  if (isLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading gyms...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>Failed to load gyms. Please try again later.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Gym Management</h2>
              <p className="text-muted">Manage gym locations and facilities</p>
            </div>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <i className="bi bi-plus me-2"></i>
              Add New Gym
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Gym Locations</h5>
            </Card.Header>
            <Card.Body>
              {gyms && gyms.length > 0 ? (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Address</th>
                      <th>Capacity</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gyms.map((gym: Gym) => (
                      <tr key={gym.id}>
                        <td>
                          <strong>{gym.name}</strong>
                        </td>
                        <td>{gym.city}</td>
                        <td>{gym.address}</td>
                        <td>
                          <span className="badge bg-info">
                            {gym.capacity} people
                          </span>
                        </td>
                        <td>{gym.phone}</td>
                        <td>
                          <span 
                            className={`badge ${gym.isActive ? 'bg-success' : 'bg-danger'}`}
                          >
                            {gym.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowModal(gym)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-building" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                  <h5 className="mt-3 text-muted">No gyms found</h5>
                  <p className="text-muted">Add your first gym to get started</p>
                  <Button variant="primary" onClick={() => handleShowModal()}>
                    Add New Gym
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Gym Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGym ? 'Edit Gym' : 'Add New Gym'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gym Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter gym name"
                    defaultValue={selectedGym?.name || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    defaultValue={selectedGym?.city || ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full address"
                defaultValue={selectedGym?.address || ''}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    defaultValue={selectedGym?.phone || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    defaultValue={selectedGym?.email || ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Maximum capacity"
                    defaultValue={selectedGym?.capacity || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={selectedGym?.isActive ? 'true' : 'false'}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="List amenities separated by commas"
                defaultValue={selectedGym?.amenities?.join(', ') || ''}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary">
            {selectedGym ? 'Update Gym' : 'Add Gym'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GymsPage;
