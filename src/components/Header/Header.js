import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../database/firebaseconfig";
import {
    getDocs,
    collection,
    query,
    where,
  } from "firebase/firestore";
  
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import './Header.css'
import { Link } from "react-router-dom";

const Home = () => {
    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    const [totalCorrente, setTotalCorrente] = useState(0);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalDespesas, setTotalDespesas] = useState(0);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                // Obter o mês atual
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // Os meses em JavaScript são baseados em zero, então somei 1 para obter o mês atual

                // Consulta para obter todos os documentos da coleção "bancos"
                const bancosCollectionRef = collection(db, "bancos");
                const querySnapshot = await getDocs(query(bancosCollectionRef, where("uid", "==", user.uid)));

                // Consulta para obter todas as receitas do mês atual
                const receitasCollectionRef = collection(db, "receitas");
                const querySnapshotReceitas = await getDocs(query(receitasCollectionRef, 
                    where("uid", "==", user.uid),
                    where("date", ">=", new Date(currentDate.getFullYear(), currentMonth - 1, 1)),
                    where("date", "<", new Date(currentDate.getFullYear(), currentMonth, 1))
                ));

                // Consulta para obter todas as despesas do mês atual
                const despesasCollectionRef = collection(db, "despesas");
                const querySnapshotDespesas = await getDocs(query(despesasCollectionRef, 
                    where("uid", "==", user.uid),
                    where("date", ">=", new Date(currentDate.getFullYear(), currentMonth - 1, 1)),
                    where("date", "<", new Date(currentDate.getFullYear(), currentMonth, 1))
                ));

                let totalSaldoCorrente = 0;
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    totalSaldoCorrente += parseFloat(data.saldoCorrente);
                });

                let totalReceitas = 0;
                querySnapshotReceitas.forEach((doc) => {
                    const data = doc.data();
                    totalReceitas += parseFloat(data.valor);
                });

                let totalDespesas = 0;
                querySnapshotDespesas.forEach((doc) => {
                    const data = doc.data();
                    totalDespesas += parseFloat(data.valor);
                });

                setTotalCorrente(totalSaldoCorrente);
                setTotalReceitas(totalReceitas);
                setTotalDespesas(totalDespesas);
            }
        });

        return () => unsubscribe();

    }, []);


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
                                    <p className="userSaldo">R$ {parseFloat(totalCorrente).toFixed(2)}</p>
                                </Row>
                              
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="">
                                <Row className="saldoGreen">
                                    <div className="saldo mt-3 mb-3">
                                        <Row className="text-center">
                                            <h6 className="my-1">receita mensal</h6>
                                        </Row>
                                        <Row className="text-center">
                                          
                                            <h4>+ R$ {parseFloat(totalReceitas).toFixed(2)}</h4>
                                        </Row>
                                    </div>
                                </Row>
                                <Row className="despesaRed">
                                    <div className="despesa mb-3">
                                        <Row className="text-center">
                                            <h6 className="my-1">despesa mensal</h6>
                                        </Row>
                                        <Row className="text-center">

                                            <h4>- R$ {parseFloat(totalDespesas).toFixed(2)}</h4>
                                        </Row>
                                    </div>
                                </Row>
                            </div>
                        </Col>

                        <Col xs={12} lg={4}>
                            <div className="btnText">
                                
                                <Row>
                                    <Link to='/GerenciarContas'>   
                                   <Button className="btnHeader">Gerenciar Contas</Button> 
                                    </Link>
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
