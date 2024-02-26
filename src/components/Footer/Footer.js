
import { Col, Container, Row } from 'react-bootstrap';
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faMoneyBillTransfer, faChartColumn, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const Footer = () =>{
    return(
        <footer className="footer mt-5">
            <Container>
                <div className='navFooter'>

                <Row>
                    <Col>
                    <Link to='/Home'>
                    
                    <FontAwesomeIcon className='iconF' color='#408558' icon={faHouse} />
                    </Link>
                    </Col>
                    <Col>
                    <FontAwesomeIcon className='iconF' color='#606060' icon={faMoneyBillTransfer} />
                    </Col>
                    <Col className='mais'>
                        <Link className='textMais' to='/CadDespesas'>
                        
                        +
                        </Link>
                    </Col>
                    <Col>
                    <FontAwesomeIcon className='iconF' color='#606060' icon={faChartColumn} />
                    </Col>
                    <Col>
                    <FontAwesomeIcon className='iconF' color='#606060' icon={faCalendar} />    
                    </Col>
                </Row>
                </div>
            </Container>
           
        </footer>
    )
}

export default Footer;