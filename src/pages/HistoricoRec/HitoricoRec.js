import { Card, Container, Row, Col } from 'react-bootstrap';
import './HistoricoRec.css';
import Footer from '../../components/Footer/Footer';
import { useEffect, useState } from 'react';
import { app, db } from "../../database/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Historico = () => {
    const [receitas, setReceitas] = useState([]);
    const [user, setUser] = useState(null);
    // eslint-disable-next-line 
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                console.error("Usuário não autenticado.");
                return;
            }

            if (!user.uid) {
                console.error("UID do usuário inválido.");
                return;
            }
            // Consulta para obter todas as receitas do usuário
            const q = query(collection(db, 'receitas'), where('uid', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const receitasData = querySnapshot.docs.map(doc => doc.data());
            // Ordena as receitas por data, da mais nova para a mais antiga
            receitasData.sort((a, b) => b.date - a.date);
            setReceitas(receitasData);
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                const userDocRef = doc(db, "users", user.uid);

                try {
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        setUserData(userDocSnapshot.data());
                    } else {
                        console.log("Documento de usuário não encontrado no Firestore.");
                        console.log(userDocSnapshot);
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados de usuário no Firestore:", error);
                }
            }
        });

        return () => unsubscribe();

        // eslint-disable-next-line
    }, [user]);

    return (
        <>
            <div className="nav">

            </div>
            <Footer />
            <Container className="cont pb-5 mb-5">
                <Row>
                    <p className="topTitle">Histórico</p>
                    <Row className=" navCard pb-3">

                        <Col className=" mx-5" >
                            <Link to='/Historico' className="navCard2">
                                DESPESA
                            </Link>
                        </Col>

                        <Col className=" mx-5">
                            <Link to='/HistoricoRec' className="navCard">
                                RECEITA
                            </Link>
                        </Col>
                    </Row>
                </Row>
                <Card className=''>
                    <Card.Body className=''>
                        {receitas.map((receita, index) => (
                            <Row className='textHi' key={index}>
                                <Col xs={6}>
                                    <p>{receita.categoria}</p>
                                </Col>
                                <Col xs={3}>
                                    <p>R$ {receita.valor}</p>
                                </Col>
                                <Col xs={3}>
                                    <p>{receita.date && receita.date.toDate().toLocaleDateString()}</p>
                                </Col>
                                <hr />
                            </Row>
                        ))}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Historico;
