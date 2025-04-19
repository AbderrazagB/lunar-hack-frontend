import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaSearch } from 'react-icons/fa';
import UniversalNavbar from '../navbar/UniversalNavbar';
import '../../styles/landing-page.scss';
import FSTView from '../../assets/images/fst_view.png';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add animation classes to elements when component mounts
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('visible');
        }, 200 * index);
      });
    };

    // Run animation after a short delay
    setTimeout(animateElements, 300);
  }, []);

  return (
    <div className="landing-page">
      <UniversalNavbar />

      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="hero-content animate-on-scroll">
                <h1 className="display-3 fw-bold mb-4">Bienvenue à Notre Université</h1>
                <p className="lead mb-4">
                  Découvrez un monde de connaissances, d'innovation et d'opportunités dans notre institution prestigieuse.
                  Rejoignez notre communauté d'érudits et façonnez l'avenir.
                </p>
                <div className="d-flex gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="me-2 animate-on-scroll"
                    onClick={() => navigate('/chatbot')}
                  >
                    <FaRobot className="me-2" /> Parler à l'Assistant
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    className="animate-on-scroll"
                    onClick={() => navigate('/lost-and-found')}
                  >
                    <FaSearch className="me-2" /> Objets Trouvés
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image animate-on-scroll">
                <div className="image-placeholder">
                  <img src={FSTView} alt="Vue de l'Université" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5 animate-on-scroll">Pourquoi Choisir Notre Université</h2>
          <Row>
            {[
              { title: 'Éducation de Classe Mondiale', description: 'Apprenez auprès d\'experts dans leurs domaines avec un programme d\'études de pointe.' },
              { title: 'Opportunités de Recherche', description: 'Engagez-vous dans des recherches révolutionnaires qui façonnent l\'avenir.' },
              { title: 'Vie Étudiante Dynamique', description: 'Vivez une communauté diverse et inclusive avec des activités sans fin.' },
              { title: 'Soutien à la Carrière', description: 'Accédez aux services de carrière et aux réseaux d\'anciens élèves pour lancer votre avenir.' }
            ].map((feature, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <div className="feature-card animate-on-scroll">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <footer className="footer py-4">
        <Container>
          <Row>
            <Col md={6}>
              <p className="mb-0">© 2023 Université. Tous droits réservés.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="footer-links">
                <a href="#privacy">Politique de Confidentialité</a>
                <a href="#terms">Conditions d'Utilisation</a>
                <a href="#contact">Contactez-nous</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage; 