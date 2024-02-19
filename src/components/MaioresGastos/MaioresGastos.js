import { Card, Container, Row, Col } from "react-bootstrap"
import './MaioresGastos.css'

const MaioresGastos = () =>{
    return(
        <Container className="cardBody py-3">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Maiores gastos do mês</p>
                    </Row>

                    <Row>
                        <Col xs={9}>
                        <p>Alimentação</p>
                        </Col>
                        <Col xs={3}>
                        <p className="porc">25%</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={9}>
                        <p>Saúde</p>
                        </Col>
                        <Col xs={3}>
                        <p className="porc">25%</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={9}>
                        <p>Diversão</p>
                        </Col>
                        <Col xs={3}>
                        <p className="porc">25%</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={9}>
                        <p>Compras</p>
                        </Col>
                        <Col xs={3}>
                        <p className="porc">25%</p>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        </Container>
    )
}

export default MaioresGastos;