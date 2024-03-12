
import { Col, Container, Row } from 'react-bootstrap';
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faMoneyBillTransfer, faChartColumn, faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Footer = () =>{
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setCurrentPage(location.pathname);
    }, [location]);

    return(
        <footer className="footer mt-5">
            <Container>
                <div className='navFooter'>
                    <Row>
                        <Col>
                            <Link to='/Home'>
                                <FontAwesomeIcon className={`iconF ${currentPage === '/Home' ? 'active' : 'colorActive'}`} color='#408558' icon={faHouse} />
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/Historico'>
                                <FontAwesomeIcon className={`iconF ${currentPage === '/Historico' ? 'active' : 'colorActive'}`} color='#408558' icon={faMoneyBillTransfer} />
                            </Link>
                        </Col>
                        <Col className='mais'>
                            <Link className='textMais' to='/CadDespesas'>+</Link>
                        </Col>
                        <Col>
                            <Link to='/Graficos'>
                                <FontAwesomeIcon className={`iconF ${currentPage === '/Graficos' ? 'active' : 'colorActive'}`} color='#408558' icon={faChartColumn} />
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/GerenciarFaturas'>
                                <FontAwesomeIcon className={`iconF ${currentPage === '/GerenciarFaturas' ? 'active' : 'colorActive'}`} color='#408558' icon={faCreditCard} />    
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Container>
        </footer>
    )
}

export default Footer;