import { Container, Card, Row, Col } from "react-bootstrap";
import './Home.css'
import despesaIcon from '../../assets/despesaIcon.png'
import receitaIcon from '../../assets/receitaicon.png'

const Home = () => {
    return (
        <Container>
            <Card className="header my-3">
                <Card.Body className="mx-5">

                    <Row>
                        <Col xs={12} lg={4}>
                            <div className="">
                                <Row>
                                    <p>Bem Vindo</p>
                                </Row>
                                <Row>
                                    <p>Familia Santos</p>
                                </Row>
                                <Row>
                                    <p>saldo geral</p>
                                </Row>
                                <Row>
                                    <p>R$ 1800,00</p>
                                </Row>
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="">
                                <Row>
                                    <div className="saldo mb-3">
                                        <Row className="text-center">
                                            <h7>receita mensal</h7>
                                        </Row>
                                        <Row className="text-center">
                                            <h4>+ R$ 850,00</h4>
                                        </Row>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="despesa">
                                        <Row className="text-center">
                                            <h7>despesa mensal</h7>
                                        </Row>
                                        <Row className="text-center">
                                            <h4>- R$ 350,00</h4>
                                        </Row>
                                    </div>
                                </Row>
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="">
                                <Row>Cadastrar</Row>
                                <Row>
                                    <Col>

                                        <div className="cadDespesa">
                                            <img src={despesaIcon} height={80} className='d-inline-block align-center mb-3' alt="despesaIcon" />
                                        </div>
                                    </Col>

                                    <Col>

                                        <div className="cadReceita">
                                            <img src={receitaIcon} height={80} className='d-inline-block align-center' alt="receitaIcon" />
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                        </Col>

                    </Row>

                </Card.Body>
            </Card>
        </Container>
    )
}

export default Home;