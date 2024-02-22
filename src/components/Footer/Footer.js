
import { Col, Container, Row } from 'react-bootstrap';
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

const Footer = () =>{
    return(
        <footer className="footer mt-5">
            <Container>
                <Row>
                    <Col>
                    <FontAwesomeIcon icon={faHouse} />
                    </Col>
                    <Col>
                        TRA
                    </Col>
                    <Col className='mais'>
                        +
                    </Col>
                    <Col>
                        REL
                    </Col>
                    <Col>
                        MES
                    </Col>
                </Row>
            </Container>
           
        </footer>
    )
}

export default Footer;