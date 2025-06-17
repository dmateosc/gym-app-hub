import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1>Gym Management Dashboard</h1>
          <p className="text-muted">Manage your gym operations efficiently</p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>
                <i className="bi bi-people-fill me-2"></i>
                Members
              </Card.Title>
              <Card.Text>
                Manage gym members, view membership details, and track member activity.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/members" className="btn btn-primary">
                  Manage Members
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>
                <i className="bi bi-building me-2"></i>
                Gyms
              </Card.Title>
              <Card.Text>
                Manage gym locations, view facility details, and track gym capacity.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/gyms" className="btn btn-primary">
                  Manage Gyms
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>
                <i className="bi bi-heart-pulse me-2"></i>
                Exercises
              </Card.Title>
              <Card.Text>
                Manage exercise library, create new exercises, and organize workout routines.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/exercises" className="btn btn-primary">
                  Exercise Library
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>
                <i className="bi bi-clipboard-check me-2"></i>
                Workout Plans
              </Card.Title>
              <Card.Text>
                Create and manage workout plans, assign to members, and track progress.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/workout-plans" className="btn btn-primary">
                  Workout Plans
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>
                <i className="bi bi-person-badge me-2"></i>
                Trainers
              </Card.Title>
              <Card.Text>
                Manage trainer profiles, schedules, and client assignments.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/trainers" className="btn btn-primary">
                  Manage Trainers
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>
                <i className="bi bi-graph-up me-2"></i>
                Sessions
              </Card.Title>
              <Card.Text>
                Track workout sessions, monitor progress, and view analytics.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/sessions" className="btn btn-primary">
                  View Sessions
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Quick Stats</Card.Title>
              <Row>
                <Col md={3} className="text-center">
                  <h3 className="text-primary">125</h3>
                  <small className="text-muted">Active Members</small>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="text-success">8</h3>
                  <small className="text-muted">Available Trainers</small>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="text-info">45</h3>
                  <small className="text-muted">Active Sessions</small>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="text-warning">3</h3>
                  <small className="text-muted">Gym Locations</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
