import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-0">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-dumbbell me-2"></i>
          Gym Manager
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/members">
              <i className="bi bi-people me-1"></i>
              Members
            </Nav.Link>
            <Nav.Link as={Link} to="/gyms">
              <i className="bi bi-building me-1"></i>
              Gyms
            </Nav.Link>
            <Nav.Link as={Link} to="/exercises">
              <i className="bi bi-heart-pulse me-1"></i>
              Exercises
            </Nav.Link>
            <Nav.Link as={Link} to="/workout-plans">
              <i className="bi bi-clipboard-check me-1"></i>
              Workout Plans
            </Nav.Link>
            <Nav.Link as={Link} to="/trainers">
              <i className="bi bi-person-badge me-1"></i>
              Trainers
            </Nav.Link>
            <Nav.Link as={Link} to="/sessions">
              <i className="bi bi-graph-up me-1"></i>
              Sessions
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link href="#settings">
              <i className="bi bi-gear me-1"></i>
              Settings
            </Nav.Link>
            <Nav.Link href="#profile">
              <i className="bi bi-person-circle me-1"></i>
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
