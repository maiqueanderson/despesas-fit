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
import './Receber.css'
import { Link } from "react-router-dom";

const Receber = () => {

    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    const [receber, setReceber] = useState([]);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                // Consulta para obter todos os documentos da coleção "bancos" onde UID é igual ao UID do usuário
                const receberCollectionRef = collection(db, "paraReceber");
                const q = query(receberCollectionRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                // Mapear os documentos e extrair nomeBanco e saldoBanco
                const receberData = querySnapshot.docs.map(doc => ({
                    categoria: doc.data().categoria,
                    valor: doc.data().valor,
                    cor: doc.data().cor
                }));

                setReceber(receberData);
            }
        });

        return () => unsubscribe();

    }, []);

    return (
        <Container className="cardBody mt-3">
        <Card>
            <Card.Body>
                <Row>
                    <p className="titleText">Valores à receber</p>
                </Row>
                {receber.length === 0 ? (
                    <Row>
                        <Col>
                        <div>

                            <p className="btnConta">Sem valores a receber</p>
                        </div>
                        </Col>
                    </Row>
                ) : (
                    receber.map((receber, index) => (
                        <Row key={index}>
                            <Col xs={2}>
                                <FontAwesomeIcon
                                    className='iconF'
                                    color={receber.cor}
                                    icon={faCircle}
                                />
                            </Col>
                            <Col xs={6}>
                                <p>{receber.categoria}</p>
                            </Col>
                            <Col xs={4}>
                                <p className="ValueText">R$ {parseFloat(receber.valor).toFixed(2)}</p>
                            </Col>
                        </Row>
                    ))
                )}
                <div className="btnConta my-3">
                    <Link to='/ReceberValor'>
                        <Button variant="outline-success">Receber Valores</Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    </Container>
    )
}

export default Receber;