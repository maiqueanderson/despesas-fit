import { Card, Col, Container, Row } from "react-bootstrap"
import './LimitesCartao.css'


const LimitesCartao = () =>{
    return(
        <Container className="cardBody">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Limites de cartão de crédito</p>
                    </Row>
                    <Row>
                        <Col xs={8}>
                        <p>Mercado Pago</p>
                        </Col>
                        <Col xs={4}>
                        <p className="valueText">R$ 345,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={8}>
                        <p>Nubank - Máique</p>
                        </Col>
                        <Col xs={4}>
                        <p className="valueText">R$ 345,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={8}>
                        <p>Nubank - Mizza</p>
                        </Col>
                        <Col xs={4}>
                        <p className="valueText">R$ 345,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={8}>
                        <p>Inter</p>
                        </Col>
                        <Col xs={4}>
                        <p className="valueText">R$ 1345,00</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default LimitesCartao;