import { Card, Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "./MaioresGastos.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from "react";
import { app, db } from "../../database/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";

const MaioresGastos = () => {
    const [maioresGastos, setMaioresGastos] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [catName, setCatName] = useState('');
    const [catCor, setCatCor] = useState('');
    const [catMeta, setCatMeta] = useState('');

    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);
    // eslint-disable-next-line
    const [categorias, setCategorias] = useState([]);

    const handleAddCategory = async () => {
        if (!catName || !catCor || !catMeta) return;

        try {
            const categoriasCollectionRef = collection(db, "categorias");
            await addDoc(categoriasCollectionRef, {
                name: catName,
                cor: catCor,
                meta: catMeta,
                uid: user.uid,
            });

            handleClose();
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const hoje = new Date();
            let ultimoDiaDoMes;

            if (hoje.getMonth() === 1 && ((hoje.getFullYear() % 4 === 0 && hoje.getFullYear() % 100 !== 0) || hoje.getFullYear() % 400 === 0)) {

                // Fevereiro em ano bissexto
                ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 2, 0);
            } else {
                // Outros meses ou anos não bissextos
                ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            }

            const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

            // Consulta para obter todas as despesas do mês atual
            const q = query(collection(db, "despesas"), where("date", ">=", primeiroDiaDoMes), where("date", "<=", ultimoDiaDoMes));
            const querySnapshot = await getDocs(q);

            // Mapear os documentos e extrair as categorias e valores das despesas
            const despesas = querySnapshot.docs.map(async (doc) => {
                const categoria = doc.data().categoria;
                const valor = doc.data().valor;

                // Consultar o documento da categoria correspondente
                const catQuery = query(collection(db, "categorias"), where("name", "==", categoria));
                const catSnapshot = await getDocs(catQuery);

                if (!catSnapshot.empty) {
                    const catData = catSnapshot.docs[0].data();
                    const cor = catData.cor;
                    return { categoria, cor, valor };
                } else {
                    console.error("Categoria não encontrada para a despesa:", categoria);
                    return null;
                }
            });

            // Filtrar despesas nulas e agrupar e somar os valores das despesas por categoria
            const despesasValidas = await Promise.all(despesas);
            const gastosPorCategoria = despesasValidas.reduce((acc, curr) => {
                if (curr) {
                    acc[curr.categoria] = (acc[curr.categoria] || 0) + parseFloat(curr.valor);
                }
                return acc;
            }, {});

            // Classificar as categorias pelos maiores gastos
            const maioresGastos = Object.entries(gastosPorCategoria)
                .sort((a, b) => b[1] - a[1])
                .map(([categoria, valor]) => {
                    const cor = despesasValidas.find((despesa) => despesa.categoria === categoria)?.cor;
                    return { categoria, valor, cor };
                });

            setMaioresGastos(maioresGastos);
        };

        fetchData();
    }, []);

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
    }, []);

    useEffect(() => {
        if (!user) return; // Se o usuário for null, saia da função

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
        <Container className="cardBody py-3">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Maiores gastos do mês</p>
                    </Row>
                    {maioresGastos.map((gasto, index) => (
                        <Row key={index}>
                            <Col xs={2}>
                                <FontAwesomeIcon
                                    className='iconF'
                                    color={gasto.cor}
                                    icon={faCircle}
                                />
                            </Col>
                            <Col xs={6}>
                                <p>{gasto.categoria}</p>
                            </Col>
                            <Col xs={4}>
                                <p className="porc">R$ {gasto.valor.toFixed(2)}</p>
                            </Col>
                        </Row>
                    ))}
                    <div className="btnMaiores py-3">
                        <Button onClick={handleShow} variant="outline-success">Criar Categoria</Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crie uma nova categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="editBank.ControlName">
                            <Form.Label>Nome da categoria</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome da categoria"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editBank.ControlMeta">
                            <Form.Label>Meta de gastos mensal</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="R$ 00,00"
                                value={catMeta}
                                onChange={(e) => setCatMeta(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Label htmlFor="exampleColorInput">Escolha a cor da categoria</Form.Label>
                        <Form.Control
                            type="color"
                            id="BankColorInput"
                            title="Escolha a cor do Banco"
                            value={catCor}
                            onChange={(e) => setCatCor(e.target.value)}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MaioresGastos;
