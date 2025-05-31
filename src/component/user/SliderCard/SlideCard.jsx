import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "./slidercard.css";

const SlideCard = ({ title, desc, cover }) => {
  const navigate = useNavigate(); // initialize navigate

  const handleVisitClick = () => {
    navigate("/user/shop"); // navigate to the shop route
  };

  return (
    <Container className='box'>
      <Row>
        <Col md={6}>
          <h1>{title}</h1>
          <p>{desc}</p>
          <button className="btnvisit" onClick={handleVisitClick}>
            Visit Collections
          </button>
        </Col>
        <Col md={6}>
          <img src={cover} alt="cover" />
        </Col>
      </Row>
    </Container>
  );
};

export default SlideCard;
