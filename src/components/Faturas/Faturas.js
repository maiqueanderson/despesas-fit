import { Card, Col, Container, Row } from "react-bootstrap";
import './Faturas.css'

const Faturas = () =>{
    return(
        <Container className="cardBody py-3">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Fatura cartão de crédito</p>
                    </Row>
                    <Row>
                        <Col xs={8}>
                        <p>Mercado Pago</p>
                        </Col>
                        <Col xs={4}>
                        <p className="ValueCredit">R$ 800,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={8}>
                        <p>Inter</p>
                        </Col>
                        <Col xs={4}>
                        <p className="ValueCredit">R$ 300,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={8}>
                        <p>Nubank</p>
                        </Col>
                        <Col xs={4}>
                        <p className="ValueCredit">R$ 200,00</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Faturas;