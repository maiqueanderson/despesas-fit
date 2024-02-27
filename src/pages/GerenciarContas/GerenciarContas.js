import { Card, Col, Container, Row } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app, db } from "../../database/firebaseconfig";
import { collection, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './GerenciarContas.css'

const GerenciarContas = () => {
    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);
    // eslint-disable-next-line
    const [userBankData, setUserBankData] = useState(null);
    const [bancos, setBancos] = useState([]);
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

    const [selectedBank, setSelectedBank] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedSaldoCorrente, setEditedSaldoCorrente] = useState(0);
    const [editedSaldoPoupanca, setEditedSaldoPoupanca] = useState(0);
    const [editedCor, setEditedCor] = useState("");

    const [newName, setNewName] = useState("");
    const [newSaldoCorrente, setNewSaldoCorrente] = useState(0);
    const [newSaldoPoupanca, setNewSaldoPoupanca] = useState(0);
    const [newCor, setNewCor] = useState("");

    const [bankToDelete, setBankToDelete] = useState(null);

    const handleDeleteBank = (banco) => {
        setBankToDelete(banco);
        handleShow2();
    };

    //Função para adicionar novas contas de banco
    const handleAddBank = async () => {
        if (!user || !newName || !newSaldoCorrente || !newCor) return;
    
        try {
            const bancosCollectionRef = collection(db, "bancos");
            await addDoc(bancosCollectionRef, {
                uid: user.uid,
                name: newName,
                saldoCorrente: parseFloat(newSaldoCorrente),
                saldoPoupanca: parseFloat(newSaldoPoupanca),
                cor: newCor,
            });
    
            // Atualizar localmente a lista de bancos
            setBancos([...bancos, {
                name: newName,
                saldoCorrente: parseFloat(newSaldoCorrente),
                saldoPoupanca: parseFloat(newSaldoPoupanca),
                cor: newCor,
            }]);
    
            handleClose3();
        } catch (error) {
            console.error("Erro ao adicionar banco:", error);
        }
    };
    

    // Função para excluir o banco selecionado
    const handleConfirmDelete = async () => {
        if (!bankToDelete || !user) return;

        try {
            const bancosCollectionRef = collection(db, "bancos");
            const querySnapshot = await getDocs(query(bancosCollectionRef, where("uid", "==", user.uid), where("name", "==", bankToDelete.name)));

            if (!querySnapshot.empty) {
                const bankRef = querySnapshot.docs[0].ref;
                await deleteDoc(bankRef);

                // Atualiza localmente a lista de bancos
                setBancos((prevBancos) => prevBancos.filter((banco) => banco.name !== bankToDelete.name));

                handleClose2();
            } else {
                console.log("Nenhum documento encontrado para o banco selecionado.");
            }
        } catch (error) {
            console.error("Erro ao excluir banco:", error);
        }
    };







    // Função para atualizar o banco selecionado
    const handleEditBank = (banco) => {
        setSelectedBank(banco);
        setEditedName(banco.name);
        setEditedSaldoCorrente(banco.saldoCorrente);
        handleShow();
    };

    const handleUpdateBank = async () => {
        if (!selectedBank || !user) return;

        try {
            const bancosCollectionRef = collection(db, "bancos");
            const querySnapshot = await getDocs(query(bancosCollectionRef, where("uid", "==", user.uid), where("name", "==", selectedBank.name)));

            if (!querySnapshot.empty) {
                const bankRef = querySnapshot.docs[0].ref;
                await updateDoc(bankRef, {
                    name: editedName,
                    saldoCorrente: parseFloat(editedSaldoCorrente),
                    cor: editedCor,
                    saldoPoupanca: editedSaldoPoupanca,
                });

                // Atualizar localmente o banco selecionado
                setSelectedBank((prevBank) => ({
                    ...prevBank,
                    name: editedName,
                    saldoCorrente: parseFloat(editedSaldoCorrente),
                    cor: editedCor,
                    saldoPoupanca: editedSaldoPoupanca,
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

                try {
                    const userDocSnapshot = await getDoc(userDocRef);
                    const bankDocSnapshot = await getDoc(userBankRef);

                    if (userDocSnapshot.exists()) {
                        setUserData(userDocSnapshot.data());
                        setUserBankData(bankDocSnapshot.data());
                    } else {
                        console.log("Documento de usuário não encontrado no Firestore.");
                        console.log(userDocSnapshot);
                    }

                    // Consulta para obter todos os documentos da coleção "bancos" onde o campo "uid" seja igual ao UID do usuário
                    const bancosCollectionRef = collection(db, "bancos");
                    const querySnapshot = await getDocs(query(bancosCollectionRef, where("uid", "==", user.uid)));

                    // Mapear os documentos e extrair os dados
                    const bancosData = querySnapshot.docs.map((doc) => doc.data());
                    setBancos(bancosData);
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
                    <p className="topTitle">Contas</p>
                </Row>

                <Card className="my-3">
                    <Card.Body className="my-3">
                        <h5>Bancos cadastrados</h5>
                        <Row className="py-3">
                            <Col xs={1}>
                                {bancos.map((banco, indexI) => (
                                    <div className="my-3" key={indexI}>
                                        <FontAwesomeIcon
                                            
                                            color={banco.cor}
                                            icon={faCircleDot}
                                        />
                                    </div>
                                ))}
                            </Col>

                            <Col xs={5}>
                                {bancos.map((banco, index) => (
                                    <div className="my-3" key={index}>{banco.name}</div>
                                ))}
                            </Col>
                            <Col xs={4}>
                                {bancos.map((banco, index2) => (
                                    <div className="my-3" key={index2}>R$ {banco.saldoCorrente.toFixed(2)}</div>
                                    
                                ))}
                            </Col>
                            <Col xs={1}>
                                {bancos.map((banco, index3) => (
                                    <div className="my-3" key={index3}>
                                        <FontAwesomeIcon
                                           
                                            color='#606060'
                                            icon={faPenToSquare}
                                            onClick={() => handleEditBank(banco)}
                                        />
                                    </div>
                                ))}
                            </Col>
                            <Col xs={1}>
                                {bancos.map((banco, index4) => (
                                    <div className="my-3" key={index4}>
                                        <FontAwesomeIcon
                                            
                                            color='#c32722'
                                            icon={faTrash}
                                            onClick={() => handleDeleteBank(banco)}
                                        />
                                    </div>
                                ))}
                            </Col>
                        </Row>
                        <Row>
                            <div className="btnText">
                            <Button className="btnHeader" onClick={handleShow3}>Adicionar Conta</Button>

                            </div>
                        </Row>
                    </Card.Body>
                </Card>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar o Banco</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="editBank.ControlName">
                                <Form.Label>Nome do Banco</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome do Banco"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBank.ControlSaldo">
                                <Form.Label>Saldo conta corrente</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="00,00"
                                    value={editedSaldoCorrente}
                                    onChange={(e) => setEditedSaldoCorrente(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBank.ControlSaldo">
                                <Form.Label>Saldo conta poupança</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="00,00"
                                    value={editedSaldoPoupanca}
                                    onChange={(e) => setEditedSaldoPoupanca(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Label htmlFor="exampleColorInput">Escolha a cor do Banco</Form.Label>
                            <Form.Control
                                type="color"
                                id="BankColorInput"

                                title="Escolha a cor do Banco"
                                value={editedCor}
                                onChange={(e) => setEditedCor(e.target.value)}
                            />
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
            <Form.Group className="mb-3" controlId="editBank.ControlName">
                <Form.Label>Nome do Banco</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nome do Banco"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editBank.ControlSaldo">
                <Form.Label>Saldo conta corrente</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="00,00"
                    value={newSaldoCorrente}
                    onChange={(e) => setNewSaldoCorrente(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editBank.ControlSaldo">
                <Form.Label>Saldo conta poupança</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="00,00"
                    value={newSaldoPoupanca}
                    onChange={(e) => setNewSaldoPoupanca(e.target.value)}
                />
            </Form.Group>
            <Form.Label htmlFor="exampleColorInput">Escolha a cor do Banco</Form.Label>
            <Form.Control
                type="color"
                id="BankColorInput"
                title="Escolha a cor do Banco"
                value={newCor}
                onChange={(e) => setNewCor(e.target.value)}
            />
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose3}>
            Cancelar
        </Button>
        <Button variant="primary" onClick={handleAddBank}>
            Salvar
        </Button>
    </Modal.Footer>
</Modal>


            </Container>
        </>
    );
};

export default GerenciarContas;
