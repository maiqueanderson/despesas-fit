import { Card, Col, Container, Row } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app, db } from "../../database/firebaseconfig";
import { collection, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './GerenciarFaturas.css'

const GerenciarFaturas = () => {

    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);
    // eslint-disable-next-line
    const [userBankData, setUserBankData] = useState(null);
    // eslint-disable-next-line
    const [userFaturaData, setUserFaturaData] = useState(null);
    const [bancos, setBancos] = useState([]);
    const [faturas, setFaturas] = useState([]);
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleClose3 = () => setShow3(false);
    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);
    const handleShow3 = () => setShow3(true);


    const [selectedFatura, setSelectedFatura] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedValor, setEditedValor] = useState(0);

    const [bankName, setBankName] = useState("");
    const [faturakName, setFaturaName] = useState("");
    const [valorFatura, setValorFatura] = useState(0);

    const [faturaToDelete, setFaturaToDelete] = useState(null);

    const handleDeleteBank = (faturas) => {
        setFaturaToDelete(faturas);
        handleShow2();
    };

    //Função para adicionar novas contas de banco
    //Função para adicionar novas faturas
    const handleAddFatura = async () => {
        if (!user || !bankName || !valorFatura) return;

        try {
            const faturasCollectionRef = collection(db, "faturas");
            await addDoc(faturasCollectionRef, {
                uid: user.uid,
                banco: bankName,
                valor: parseFloat(valorFatura),
            });

            // Atualizar localmente a lista de faturas
            setFaturas([...faturas, {
                banco: bankName,
                valor: parseFloat(valorFatura),
            }]);

            handleClose3();
        } catch (error) {
            console.error("Erro ao adicionar fatura:", error);
        }
    };

    const handlePagarFatura = async () => {
        if (!user || !bankName || !faturakName) return;
    
        try {
            // Verifica se o banco pertence ao usuário logado
            const bancosCollectionRef = collection(db, "bancos");
            const bancosQuery = query(bancosCollectionRef, where("name", "==", bankName), where("uid", "==", user.uid));
            const bancosSnapshot = await getDocs(bancosQuery);
    
            if (!bancosSnapshot.empty) {
                // Banco pertence ao usuário, cria a despesa
                const despesasCollectionRef = collection(db, "despesas");
                await addDoc(despesasCollectionRef, {
                    banco: bankName,
                    categoria: 'Cartão de crédito',
                    cor: '#2b1212',
                    date: new Date(),
                    uid: user.uid,
                    valor: parseFloat(valorFatura),
                    status: "pago",
                });
    
                // Exclui a fatura selecionada
                const faturasCollectionRef = collection(db, "faturas");
                const querySnapshot = await getDocs(query(faturasCollectionRef, where("uid", "==", user.uid), where("banco", "==", faturakName)));
    
                if (!querySnapshot.empty) {
                    const faturaRef = querySnapshot.docs[0].ref;
                    await deleteDoc(faturaRef);
    
                    // Atualiza localmente a lista de faturas
                    setFaturas((prevFaturas) => prevFaturas.filter((fatura) => fatura.banco !== faturakName));
    
                    console.log("Fatura excluída com sucesso!");
                } else {
                    console.log("Nenhum documento encontrado para a fatura selecionada.");
                }
    
                // Subtrair o valor da despesa do saldoCorrente do banco selecionado
                const bancoDoc = bancosSnapshot.docs[0];
                const saldoCorrenteAtual = bancoDoc.data().saldoCorrente;
                const novoSaldoCorrente = saldoCorrenteAtual - parseFloat(valorFatura);
    
                // Atualizar o saldoCorrente no banco selecionado
                await updateDoc(bancoDoc.ref, {
                    saldoCorrente: novoSaldoCorrente,
                });
    
                console.log("Despesa paga adicionada com sucesso!");
            } else {
                console.error("O banco selecionado não pertence ao usuário.");
            }
    
            setBankName("");
            setValorFatura(0);
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error);
        }
    };
    
    
    // Função para excluir a fatura selecionada
    const handleConfirmDelete = async () => {
        if (!faturaToDelete || !user) return;

        try {
            const bancosCollectionRef = collection(db, "faturas");
            const querySnapshot = await getDocs(query(bancosCollectionRef, where("uid", "==", user.uid), where("banco", "==", faturaToDelete.banco)));

            if (!querySnapshot.empty) {
                const faturaRef = querySnapshot.docs[0].ref;
                await deleteDoc(faturaRef);

                // Atualiza localmente a lista de faturas
                setFaturas((prevFaturas) => prevFaturas.filter((fatura) => fatura.banco !== faturaToDelete.banco));

                handleClose2();
            } else {
                console.log("Nenhum documento encontrado para a fatura selecionada.");
            }
        } catch (error) {
            console.error("Erro ao excluir fatura:", error);
        }
    };







    // Função para atualizar o banco selecionado
    const handleEditBank = (fatura) => {
        setSelectedFatura(fatura);
        setEditedName(fatura.banco);
        setEditedValor(fatura.valor);
        handleShow();
    };

    const handleUpdateBank = async () => {
        if (!selectedFatura || !user) return;

        try {
            const faturasCollectionRef = collection(db, "faturas");
            const querySnapshot = await getDocs(query(faturasCollectionRef, where("uid", "==", user.uid), where("banco", "==", selectedFatura.banco)));

            if (!querySnapshot.empty) {
                const faturaRef = querySnapshot.docs[0].ref;
                await updateDoc(faturaRef, {
                    banco: editedName,
                    valor: parseFloat(editedValor),
                });

                // Atualizar localmente o banco selecionado
                setSelectedFatura((prevFatura) => ({
                    ...prevFatura,
                    banco: editedName,
                    valor: parseFloat(editedValor),
                }));

                handleClose();
                navigate("/Home");
            } else {
                console.log("Nenhum documento encontrado para o banco selecionado.");
            }
        } catch (error) {
            console.error("Erro ao atualizar banco:", error);
        }
    };


    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                const userDocRef = doc(db, "users", user.uid);
                const userBankRef = doc(db, "bancos", user.uid);
                const userFaturasRef = doc(db, "faturas", user.uid);

                try {
                    const userDocSnapshot = await getDoc(userDocRef);
                    const bankDocSnapshot = await getDoc(userBankRef);
                    const faturasDocSnapshot = await getDoc(userFaturasRef);

                    if (userDocSnapshot.exists()) {
                        setUserData(userDocSnapshot.data());
                        setUserBankData(bankDocSnapshot.data());
                        setUserFaturaData(faturasDocSnapshot.data());
                    } else {
                        console.log("Documento de usuário não encontrado no Firestore.");
                        console.log(userDocSnapshot);
                    }

                    const bancosCollectionRef = collection(db, "bancos");
                    const querySnapshotBancos = await getDocs(query(bancosCollectionRef, where("uid", "==", user.uid)));
                    const bancosData = querySnapshotBancos.docs.map((doc) => doc.data());
                    setBancos(bancosData);

                    const faturasCollectionRef = collection(db, "faturas");
                    const querySnapshotFaturas = await getDocs(query(faturasCollectionRef, where("uid", "==", user.uid)));
                    const faturasData = querySnapshotFaturas.docs.map((doc) => doc.data());
                    setFaturas(faturasData);
                } catch (error) {
                    console.error("Erro ao buscar dados de usuário no Firestore:", error);
                }
            }
        });

        return () => unsubscribe();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="nav"></div>
            <Footer />

            <Container className="cont pb-3">

                <Row>
                    <p className="topTitle">Faturas</p>
                </Row>

                <Card className="my-3">
                    <Card.Body className="my-3">
                        <h5>Faturas cadastradas</h5>
                        <Row className="py-3">

                            <Col xs={6}>
                                {faturas.map((faturas, index) => (
                                    <div className="my-3" key={index}>{faturas.banco}</div>
                                ))}
                            </Col>
                            <Col xs={4}>
                                {faturas.map((faturas, index2) => (
                                    <div className="my-3" key={index2}>R$ {faturas.valor.toFixed(2)}</div>

                                ))}
                            </Col>
                            <Col xs={1}>
                                {faturas.map((faturas, index3) => (
                                    <div className="my-3" key={index3}>
                                        <FontAwesomeIcon

                                            color='#606060'
                                            icon={faPenToSquare}
                                            onClick={() => handleEditBank(faturas)}
                                        />
                                    </div>
                                ))}
                            </Col>
                            <Col xs={1}>
                                {faturas.map((faturas, index4) => (
                                    <div className="my-3" key={index4}>
                                        <FontAwesomeIcon

                                            color='#c32722'
                                            icon={faTrash}
                                            onClick={() => handleDeleteBank(faturas)}
                                        />
                                    </div>
                                ))}
                            </Col>
                        </Row>
                        <Row>
                            <div className="btnText">
                                <Button className="btnHeader" onClick={handleShow3}>Adicionar Fatura</Button>

                            </div>
                        </Row>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <Form>
                            <p className="title">Pagar Fatura</p>
                            <Form.Label>Qual fatura quer pagar?</Form.Label>
                            <Form.Select
                                className="mb-3"
                                value={faturakName}
                                onChange={(e) => setFaturaName(e.target.value)}
                            >
                                <option>Selecione a fatura</option>
                                {faturas.map((fatura, index) => (
                                    <option key={index} value={fatura.banco}>
                                        {fatura.banco} - R$ {fatura.valor.toFixed(2)}
                                    </option>
                                ))}
                            </Form.Select>

                            <Form.Label>Pagar com saldo de:</Form.Label>
                            <Form.Select
                                className="mb-3"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            >
                                <option value="">Selecione um banco</option>
                                {bancos.map((banco, index) => (
                                    <option key={index} value={banco.name}>
                                        {banco.name}
                                    </option>
                                ))}
                            </Form.Select>

                            <div className="btnGF py-3">
                                <Button variant="success" onClick={handlePagarFatura}>Pagar fatura</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Fatura</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="editBank.ControlName">
                               

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBank.ControlSaldo">
                                <Form.Label>Valor da Fatura</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="00,00"
                                    value={editedValor}
                                    onChange={(e) => setEditedValor(e.target.value)}
                                />
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleUpdateBank}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tem certeza que deseja deletar o banco?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Quando clicar em deletar você ira perder todos os dados referentes a esse banco</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose2}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Deletar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show3} onHide={handleClose3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adicionar Conta de Banco</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>

                            <Form.Group className="mb-3" controlId="BancosDespesa">
                                <Form.Label>Conta de banco:</Form.Label>
                                <Form.Select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                >
                                    <option value="">Selecione um banco</option>
                                    {bancos.map((banco, index11) => (
                                        <option key={index11} value={banco.name}>
                                            {banco.name}
                                        </option>
                                    ))}
                                </Form.Select>

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editBank.ControlSaldo">
                                <Form.Label>Valor da Fatura</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="00,00"
                                    value={valorFatura}
                                    onChange={(e) => setValorFatura(e.target.value)}
                                />
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose3}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleAddFatura}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Container>
        </>
    );
};

export default GerenciarFaturas;
