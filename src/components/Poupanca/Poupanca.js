import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../database/firebaseconfig";
import {
    getDocs,
    collection,
    query,
    where,
} from "firebase/firestore";

import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDot } from '@fortawesome/free-solid-svg-icons'
import './Poupanca.css'
import { Link } from "react-router-dom";

const Poupanca = () => {

    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    const [bancos, setBancos] = useState([]);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                // Consulta para obter todos os documentos da coleção "bancos" onde UID é igual ao UID do usuário
                const bancosCollectionRef = collection(db, "bancos");
                const q = query(bancosCollectionRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                // Mapear os documentos e extrair nomeBanco e saldoBanco

                const bancosData = querySnapshot.docs
                    .filter(doc => parseFloat(doc.data().saldoPoupanca) > 0)
                    .map(doc => ({
                        name: doc.data().name,
                        saldoPoupanca: doc.data().saldoPoupanca,
                        cor: doc.data().cor,
                    }));

                setBancos(bancosData);
            }
        });

        return () => unsubscribe();

    }, []);

    return (
        <Container className='cardBody'>
            <Card>
                <Card.Body >
                    <Row>
                        <p className="titleText">Poupança</p>
                    </Row>
                    {bancos.map((banco, index) => (
                        <Row key={index}>
                            <Col xs={2}>
                                <FontAwesomeIcon
                                    className='iconF'
                                    color={banco.cor}
                                    icon={faCircleDot}

                                />
                            </Col>
                            <Col xs={6}>
                                <p>{banco.name}</p>
                            </Col>
                            <Col xs={4}>
                                <p className="textPoup">R$ {parseFloat(banco.saldoPoupanca).toFixed(2)}</p>
                            </Col>
                        </Row>
                    ))}
                    <div className="btnConta my-3">
                    <Link to='/AddPoupanca'>
                    
                        <Button variant="outline-success">Gerenciar poupança</Button>
                    </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Poupanca;