import Header from "../../components/Header/Header"
import Popupanca from "../../components/Poupanca/Poupanca"
import ContaCorrente from '../../components/ContaCorrente/ContaCorrente'
import LimitesCartao from '../../components/LimitesCartao/LimitesCartao'
import Footer from "../../components/Footer/Footer"
import MaioresGastos from "../../components/MaioresGastos/MaioresGastos"
import Metas from '../../components/Metas/Metas'
import Faturas from "../../components/Faturas/Faturas"
import { Col, Container, Row } from "react-bootstrap"

const Home = () => {
    return (
        <>
            <Container>

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
            <Footer />
        </>



    )
}

export default Home;