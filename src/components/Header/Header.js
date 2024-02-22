import { Container, Card, Row, Col, Button } from "react-bootstrap";
import './Header.css'


const Home = () => {
    return (
        <Container className="pb-3">
            <Card className="my-3 ">
                <Card.Body className="mx-5 ">

                    <Row>
                        <Col xs={12} lg={4}>
                            <div>
    
                                <Row>
                                    <p className="mb-0 mt-3 saldoGeral">saldo geral</p>
                                </Row>
                                <Row>
                                    <p className="userSaldo">R$ 1800,00</p>
                                </Row>
                              
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="">
                                <Row className="saldoGreen">
                                    <div className="saldo mt-3 mb-3">
                                        <Row className="text-center">
                                            <h6>receita mensal</h6>
                                        </Row>
                                        <Row className="text-center">
                                            <h4>+ R$ 850,00</h4>
                                        </Row>
                                    </div>
                                </Row>
                                <Row className="despesaRed">
                                    <div className="despesa mb-3">
                                        <Row className="text-center">
                                            <h6>despesa mensal</h6>
                                        </Row>
                                        <Row className="text-center">
                                            <h4>- R$ 350,00</h4>
                                        </Row>
                                    </div>
                                </Row>
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div>
                                
                                <Row>
                                   <Button className="btnHeader">Gerenciar Contas</Button> 
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