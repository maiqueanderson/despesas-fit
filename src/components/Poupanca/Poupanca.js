import { Card, Col, Container, Row } from 'react-bootstrap';
import './Poupanca.css'

const Poupanca = () =>{
    return(
       <Container className='cardBody mb-3'>
        <Card>
            <Card.Body >
                <Row>
                    <p className='titleText'>Poupança</p>
                </Row>
                <Row>
                    <Col xs={8}>
                    <p>PicPay</p>
                    </Col>
                    <Col xs={4} >
                    <p className='valueText'>R$ 800,00</p>
                    </Col>
                </Row>
               
                <Row>
                    <Col xs={8}>
                    <p>Mercado Pago</p>
                    </Col>
                    <Col xs={4}>
                    <p className='valueText'>R$ 1900,00</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
       </Container>
    )
}

export default Poupanca;