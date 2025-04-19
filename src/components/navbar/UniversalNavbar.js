import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRobot, FaSearch, FaHome } from 'react-icons/fa';
import '../../styles/navbar.scss';
import FSTLogo from '../../assets/images/fst_logo.png'

const UniversalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom">
      <Container>
        <Navbar.Brand 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img alt='logo' src={FSTLogo} width="70" height="30" className='me-2'/>
          FST
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isHomePage && (
              <Nav.Link 
                onClick={() => navigate('/')}
              >
                <FaHome className="me-2" /> Accueil
              </Nav.Link>
            )}
            <Nav.Link 
              className={location.pathname === '/chatbot' ? 'active' : ''}
              onClick={() => navigate('/chatbot')}
            >
              <FaRobot className="me-2" /> Assistant
            </Nav.Link>
            <Nav.Link 
              className={location.pathname === '/lost-and-found' ? 'active' : ''}
              onClick={() => navigate('/lost-and-found')}
            >
              <FaSearch className="me-2" /> Objets Trouvés
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UniversalNavbar; 