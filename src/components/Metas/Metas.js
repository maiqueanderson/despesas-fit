
import './Metas.css'

import { Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { app, db } from "../../database/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";

const Metas = () => {

    const [maioresGastos, setMaioresGastos] = useState([]);

    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);
    // eslint-disable-next-line
    const [categorias, setCategorias] = useState([]);


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

            const hoje = new Date();
            let ultimoDiaDoMes;

            if (
                hoje.getMonth() === 1 &&
                ((hoje.getFullYear() % 4 === 0 && hoje.getFullYear() % 100 !== 0) ||
                    hoje.getFullYear() % 400 === 0)
            ) {
                ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 2, 0);
            } else {
                ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            }

            const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

            const q = query(
                collection(db, "despesas"),
                where("date", ">=", primeiroDiaDoMes),
                where("date", "<=", ultimoDiaDoMes),
                where("uid", "==", user.uid) // Filtrar despesas pelo UID do usuário
            );
            const querySnapshot = await getDocs(q);

            const despesas = querySnapshot.docs.map(async (doc) => {
                const categoria = doc.data().categoria;
                const valor = doc.data().valor;

                const catQuery = query(collection(db, "categorias"), where("name", "==", categoria), where("uid", "==", user.uid)); // Filtrar categorias pelo UID do usuário
                const catSnapshot = await getDocs(catQuery);

                if (!catSnapshot.empty) {
                    const catData = catSnapshot.docs[0].data();
                    const cor = catData.cor;
                    const meta = catData.meta;
                    return { categoria, cor, valor, meta };
                } else {
                    console.error("Categoria não encontrada para a despesa:", categoria);
                    return null;
                }
            });

            const despesasValidas = await Promise.all(despesas);
            const gastosPorCategoria = despesasValidas.reduce((acc, curr) => {
                if (curr) {
                    acc[curr.categoria] = (acc[curr.categoria] || 0) + parseFloat(curr.valor);
                }
                return acc;
            }, {});

            const categoriasArray = Object.entries(gastosPorCategoria).map(([categoria, valor]) => {
                const despesa = despesasValidas.find((despesa) => despesa.categoria === categoria);
                if (despesa) {
                    return { categoria: despesa.categoria, cor: despesa.cor, valor, meta: despesa.meta };
                }
                return null;
            });

            categoriasArray.sort((a, b) => b.valor - a.valor);

            setMaioresGastos(categoriasArray);
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
    }, []);

    useEffect(() => {
        if (!user) return;

        const categoriasCollectionRef = collection(db, "categorias");
        const categoriasQuery = query(categoriasCollectionRef, where("uid", "==", user.uid));
        const unsubscribe = onSnapshot(categoriasQuery, (snapshot) => {
            const categoriasData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategorias(categoriasData);
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <Container className="cardBody">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Metas do mês</p>
                    </Row>

                    <Row>
                        <Col>
                            <p className="titleText">Categoria</p>
                        </Col>
                        <Col>
                            <p className="titleText">Gastos</p>
                        </Col>
                        <Col>
                            <p className="titleText">Meta</p>
                        </Col>
                    </Row>
                    {maioresGastos.map((categoria, index) => (
                        // Verifica se categoria.meta não é NaN antes de renderizar
                        !isNaN(categoria.meta) && (
                            <Row key={index}>
                                <Col>
                                    <p>{categoria.categoria}</p>
                                </Col>
                                <Col>
                                    <p className={categoria.valor > categoria.meta ? "gastOver" : "gastInside"}>
                                        R$ {categoria.valor.toFixed(2)}
                                    </p>
                                </Col>
                                <Col>
                                    <p >
                                        R$ {parseFloat(categoria.meta).toFixed(2)}
                                    </p>
                                </Col>
                            </Row>
                        )
                    ))}

                </Card.Body>
            </Card>
        </Container>
    );
};

export default Metas;