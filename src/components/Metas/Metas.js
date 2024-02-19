import { Card, Col, Container, Row } from "react-bootstrap"
import './Metas.css'

const Metas = () =>{
    return(
        <Container className="cardBody">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Metas do mês</p>
                    </Row>

                    <Row>
                        <Col>
                        <p className="titleText">Categoria</p>
                        </Col>
                        <Col>
                        <p className="titleText">Meta</p>
                        </Col>
                        <Col>
                        <p className="titleText">Gasto</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <p>Alimentação</p>
                        </Col>
                        <Col>
                        <p>R$ 600,00</p>
                        </Col>
                        <Col>
                        <p className="gastOver">R$ 680,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <p>Diversão</p>
                        </Col>
                        <Col>
                        <p>R$ 400,00</p>
                        </Col>
                        <Col>
                        <p className="gastInside">R$ 250,00</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <p>Compras</p>
                        </Col>
                        <Col>
                        <p>R$ 200,00</p>
                        </Col>
                        <Col>
                        <p className="gastOver">R$ 230,00</p>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        </Container>
    )
}

export default Metas;