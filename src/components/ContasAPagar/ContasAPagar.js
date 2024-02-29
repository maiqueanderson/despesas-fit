import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../database/firebaseconfig";
import {
    getDocs,
    collection,
    query,
    where,
} from "firebase/firestore";

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import './ContasAPagar.css'
import { Link } from "react-router-dom";

const ContaCorrente = () => {

    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    const [paraPagar, setParaPagar] = useState([]);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                // Consulta para obter todos os documentos da coleção "bancos" onde UID é igual ao UID do usuário
                const paraPagarCollectionRef = collection(db, "paraPagar");
                const q = query(paraPagarCollectionRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                // Mapear os documentos e extrair nomeBanco e saldoBanco
                const paraPagarData = querySnapshot.docs.map(doc => ({
                    despesaName: doc.data().despesaName,
                    valor: doc.data().valor,
                    cor: doc.data().cor
                }));

                setParaPagar(paraPagarData);
            }
        });

        return () => unsubscribe();

    }, []);

    return (
        <Container className="cardBody mt-3">
        <Card>
            <Card.Body>
                <Row>
                    <p className="titleText">Contas à pagar</p>
                </Row>
                {paraPagar.length === 0 ? (
                    <Row>
                        <Col>
                        <div>

                            <p className="btnConta">Sem contas para pagar</p>
                        </div>
                        </Col>
                    </Row>
                ) : (
                    paraPagar.map((paraPagar, index) => (
                        <Row key={index}>
                            <Col xs={2}>
                                <FontAwesomeIcon
                                    className='iconF'
                                    color={paraPagar.cor}
                                    icon={faCircle}
                                />
                            </Col>
                            <Col xs={6}>
                                <p>{paraPagar.despesaName}</p>
                            </Col>
                            <Col xs={4}>
                                <p className="ValueText">R$ {parseFloat(paraPagar.valor).toFixed(2)}</p>
                            </Col>
                        </Row>
                    ))
                )}
                <div className="btnConta my-3">
                    <Link to='/PagarContas'>
                        <Button variant="outline-success">Pagar Contas</Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    </Container>
    )
}

export default ContaCorrente;