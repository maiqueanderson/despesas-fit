import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './Faturas.css'

const Faturas = () => {
    const [faturas, setFaturas] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchFaturas = async () => {
            if (!currentUser) return;

            const faturasCollectionRef = collection(db, "faturas");
            const q = query(faturasCollectionRef, where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const faturasData = querySnapshot.docs.map(doc => doc.data());
            setFaturas(faturasData);
        };

        fetchFaturas();
    }, [currentUser]);

    return (
        <Container className="cardBody py-3 mb-5 pb-5">
            <Card>
                <Card.Body className="pb-5">
                    <Row>
                        <p className="titleText">Fatura cartão de crédito</p>
                    </Row>
                    <Row>
                        <Col xs={8}>
                          
                                {faturas.map((fatura, index) => (
                                    <div className="my-3" key={index}>{fatura.banco}</div>
                                ))}
                           
                        </Col>
                        <Col xs={4}>
   
                                {faturas.map((fatura, index) => (
                                    <div className="my-3 ValueCredit" key={index}>R$ {fatura.valor.toFixed(2)}</div>
                                ))}
                           
                        </Col>
                    </Row>

                    <div className="btnF my-3">
                        <Link to='/AddFatura'>
                            <Button variant="outline-success">Adicionar Faturas</Button>
                        </Link>
                    </div>
                    <div className="btnF mb-3">
                        <Link to='/GerenciarFaturas'>
                            <Button variant="success">Pagar Faturas</Button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Faturas;
