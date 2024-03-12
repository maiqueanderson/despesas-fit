import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Modal } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc, onSnapshot, query, where, updateDoc, getDocs } from "firebase/firestore";
import { app, db } from "../../database/firebaseconfig";
import { Link } from "react-router-dom";
import './CadReceita.css'
import receitaPage from '../../assets/receitaPage.png'

const CadReceita = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [bancos, setBancos] = useState([]);

    const [categoriaSelect, setCategoriaSelect] = useState('');
    const [bancoSelect, setBancoSelect] = useState('');
    const [valorInput, setValorInput] = useState('');

    const [catName, setCatName] = useState('');
    const [catCor, setCatCor] = useState('');

    const handleAddCategory = async () => {
        if (!catName || !catCor) return;

        try {
            const categoriasCollectionRef = collection(db, "categoriasRC");
            await addDoc(categoriasCollectionRef, {
                name: catName,
                cor: catCor,
                uid: user.uid,
            });

            handleClose();
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
        }
    };

    const handleAddDespesa = async () => {
        const categoriaSelect = document.getElementById("CategoriaDespesa").value;
        const bancoSelect = document.getElementById("BancosDespesa").value;
        const valorInput = document.getElementById("valorDinheiro").value;

        if (!categoriaSelect || !bancoSelect || !valorInput) return;

        try {
            // Consultar o documento da categoria selecionada para obter a cor
            const catQuery = query(collection(db, "categoriasRC"), where("name", "==", categoriaSelect));
            const catSnapshot = await getDocs(catQuery);

            if (!catSnapshot.empty) {
                const categoriaData = catSnapshot.docs[0].data();
                const cor = categoriaData.cor;

                // Adicionar despesa à coleção receitas
                const receitasCollectionRef = collection(db, "receitas");
                await addDoc(receitasCollectionRef, {
                    categoria: categoriaSelect,
                    banco: bancoSelect,
                    date: new Date(),
                    valor: valorInput,
                    uid: user.uid,
                    cor: cor, // Adiciona a cor obtida da categoria
                });

                // Subtrair o valor da despesa do saldoCorrente do banco selecionado
                const bancosCollectionRef = collection(db, "bancos");
                const bancosQuery = query(bancosCollectionRef, where("name", "==", bancoSelect));
                const bancosSnapshot = await getDocs(bancosQuery);

                if (!bancosSnapshot.empty) {
                    // Verifica se a coleção não está vazia
                    const bancoDoc = bancosSnapshot.docs[0];
                    const saldoCorrenteAtual = bancoDoc.data().saldoCorrente;
                    const novoSaldoCorrente = saldoCorrenteAtual + parseFloat(valorInput);

                    // Atualizar o saldoCorrente no banco selecionado
                    await updateDoc(bancoDoc.ref, {
                        saldoCorrente: novoSaldoCorrente,
                    });

                    console.log("Receita adicionada com sucesso!");

                    // Limpar os campos após a adição
                    document.getElementById("CategoriaDespesa").value = "";
                    document.getElementById("BancosDespesa").value = "";
                    document.getElementById("valorDinheiro").value = "";

                    navigate("/Home");
                } else {
                    console.error("Documento de banco não encontrado no Firestore.");
                }
            } else {
                console.error("Documento de categoria não encontrado no Firestore.");
            }
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error);
        }
    };



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

        const categoriasCollectionRef = collection(db, "categoriasRC");
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

    useEffect(() => {
        if (!user) return; // Se o usuário for null, saia da função

        const bancosCollectionRef = collection(db, "bancos");
        const bancosQuery = query(bancosCollectionRef, where("uid", "==", user.uid));
        const unsubscribe = onSnapshot(bancosQuery, (snapshot) => {
            const bancosData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBancos(bancosData);
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <>
            <div className="nav4">
                <Row className=" navCard">

                    <Col className="mt-3 mx-5" >
                        <Link to='/CadDespesas' className="navCard2">
                            DESPESA
                        </Link>
                    </Col>

                    <Col className="mt-3 mx-5">
                        <Link to='/CadReceita' className="navCard">
                            RECEITA
                        </Link>
                    </Col>
                </Row>
            </div>

            <Container className="cardBody">

                <Card className="cardDespesa">
                    <Card.Body>
                        <div className="despesaPage">
                            <img src={receitaPage} height={80} alt="despesaPage" />
                            <p className="title my-2">Cadastrar Receita</p>
                            <Button onClick={handleShow} variant="outline-success">Criar Categoria</Button>
                        </div>

                        <Form>
                            <Form.Group className="mb-3" controlId="CategoriaDespesa">
                                <Form.Label>Categoria:</Form.Label>
                                <Form.Select
                                    value={categoriaSelect}
                                    onChange={(e) => setCategoriaSelect(e.target.value)}
                                >
                                    <option>Selecione uma categoria</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.name}>
                                            {categoria.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="BancosDespesa">
                                <Form.Label>Conta de banco:</Form.Label>
                                <Form.Select
                                    value={bancoSelect}
                                    onChange={(e) => setBancoSelect(e.target.value)}
                                >   
                                <option>Selecione um banco</option>
                                    {bancos.map((bancos) => (
                                        <option key={bancos.id} value={bancos.name}>
                                            {bancos.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="valorDinheiro">
                                <Form.Label>Valor:</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="R$ 00,00"
                                    value={valorInput}
                                    onChange={(e) => setValorInput(e.target.value)}
                                />
                            </Form.Group>

                        </Form>
                        <div className="despesaPage">
                            <Button className="button" variant="success" onClick={handleAddDespesa}>
                                Cadastrar
                            </Button>
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
            <Footer />
        </>


    )
}

export default CadReceita;