import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../database/firebaseconfig";
import {
    getDocs,
    collection,
    query,
    where,
  } from "firebase/firestore";

import { Card, Col, Container, Row } from 'react-bootstrap';
import './Poupanca.css'

const Poupanca = () =>{

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
                    }));

                setBancos(bancosData);
            }
        });

        return () => unsubscribe();

    }, []);

    return(
       <Container className='cardBody mb-3'>
        <Card>
            <Card.Body >
            <Row>
                    <p className="titleText">Poupança</p>
                </Row>
                {bancos.map((banco, index) => (
                    <Row key={index}>
                        <Col xs={8}>
                            <p>{banco.name}</p>
                        </Col>
                        <Col xs={4}>
                            <p className="textPoup">R$ {banco.saldoPoupanca}</p>
                        </Col>
                    </Row>
                ))}
            </Card.Body>
        </Card>
       </Container>
    )
}

export default Poupanca;