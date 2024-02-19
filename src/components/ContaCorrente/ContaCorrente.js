import { Card, Col, Container, Row } from "react-bootstrap";
import './ContaCorrente.css'

const ContaCorrente = () => {
    return (
        <Container className="cardBody mb-3">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Conta Corrente</p>
                    </Row>
                   
                        <Row>

                        <Col xs={8}>
                            <p>Nubank - Máique</p>
                        </Col>
                        <Col xs={4}>
                            <p className="ValueText" >R$ 2000,00</p>
                        </Col>
                        </Row>
                        <Row>

                            <Col xs={8}>
                                <p>Nubank - Mizza</p>
                            </Col>
                            <Col xs={4}>
                                <p className="ValueText" >R$ 500,00</p>
                            </Col>
                        </Row>

                        <Row>

                            <Col xs={8}>
                                <p>Inter</p>
                            </Col>
                            <Col xs={4} >
                                <p className="ValueText">R$ 800,00</p>
                            </Col>
                        </Row>

                  
                </Card.Body>
            </Card>
        </Container>
    )
}

export default ContaCorrente;