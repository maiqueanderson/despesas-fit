import Header from "../../components/Header/Header"
import Popupanca from "../../components/Poupanca/Poupanca"
import ContaCorrente from '../../components/ContaCorrente/ContaCorrente'
import LimitesCartao from '../../components/LimitesCartao/LimitesCartao'
import Footer from "../../components/Footer/Footer"
import MaioresGastos from "../../components/MaioresGastos/MaioresGastos"
import Metas from '../../components/Metas/Metas'
import Faturas from "../../components/Faturas/Faturas"
import { Col, Container, Row } from "react-bootstrap"

import './Home.css'

const Home = () => {
    return (
        <>
          <div className="nav">          
              
                </div>
                <Footer />
            <Container className="cont">
            <Row>
                                    <p className="welcome mb-0">Bem Vindo</p>
                                </Row>
                                <Row>
                                    <p className="userName">Familia Santos</p>
                                </Row>
                <Header />
                <Row>
                    <Col lg={6} xs={12}>
                        <Row>
                            <Popupanca />
                        </Row>
                        <ContaCorrente />
                        <Row>
                            <LimitesCartao />
                        </Row>

                        <Row>

                        </Row>
                    </Col>


                    <Col lg={6} xs={12}>
                        <Row>
                            <MaioresGastos />
                        </Row>

                        <Row>
                            <Metas />
                        </Row>

                        <Row>
                            <Faturas />
                        </Row>
                    </Col>
                </Row>
                
            </Container>
           
        </>



    )
}

export default Home;