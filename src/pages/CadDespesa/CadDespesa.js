import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Modal } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc, onSnapshot, query, where, updateDoc, getDocs } from "firebase/firestore";
import { app, db } from "../../database/firebaseconfig";
import './CadDespesa.css'
import despesaPage from '../../assets/despesaPage.png'
import { Link } from "react-router-dom";

const CadDespesa = () => {

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


    const [catName, setCatName] = useState('');
    const [catCor, setCatCor] = useState('');

    const handleAddCategory = async () => {
        if (!catName || !catCor) return;

        try {
            const categoriasCollectionRef = collection(db, "categorias");
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
        const tipoCompraSelect = document.getElementById("TipoDeCompra").value;
        const valorInput = document.getElementById("valorDinheiro").value;
    
        if (!categoriaSelect || !bancoSelect || !tipoCompraSelect || !valorInput) return;
    
        try {
            // Consultar o documento da categoria selecionada para obter a cor
            const catQuery = query(collection(db, "categorias"), where("name", "==", categoriaSelect));
            const catSnapshot = await getDocs(catQuery);
    
            if (!catSnapshot.empty) {
                const categoriaData = catSnapshot.docs[0].data();
                const cor = categoriaData.cor;
    
                // Adicionar despesa à coleção despesas
                const despesasCollectionRef = collection(db, "despesas");
                await addDoc(despesasCollectionRef, {
                    categoria: categoriaSelect,
                    banco: bancoSelect,
                    tipoConta: tipoCompraSelect,
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
                    const novoSaldoCorrente = saldoCorrenteAtual - parseFloat(valorInput);
    
                    // Atualizar o saldoCorrente no banco selecionado
                    await updateDoc(bancoDoc.ref, {
                        saldoCorrente: novoSaldoCorrente,
                    });
    
                    console.log("Despesa adicionada com sucesso!");
    
                    // Limpar os campos após a adição
                    document.getElementById("CategoriaDespesa").value = "";
                    document.getElementById("BancosDespesa").value = "";
                    document.getElementById("TipoDeCompra").value = "Debito";
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
            <div className="nav2">
                <Row className=" navCard">

                    <Col className="mt-3 mx-5" >
                        <Link to='/CadDespesas' className="navCard">
                            DESPESA
                        </Link>
                    </Col>

                    <Col className="mt-3 mx-5">
                        <Link to='/CadReceita' className="navCard2">
                            RECEITA
                        </Link>
                    </Col>
                </Row>
            </div>

            <Container className="cardBody">

                <Card className="cardDespesa">
                    <Card.Body>
                        <div className="despesaPage">
                            <img src={despesaPage} height={80} alt="despesaPage" />
                            <p className="titleD my-2">Cadastrar Despesa</p>
                            <Button onClick={handleShow} variant="outline-danger">Criar Categoria</Button>

                        </div>

                        <Form>
                            <Form.Group className="mb-3" controlId="CategoriaDespesa">
                                <Form.Label>Categoria:</Form.Label>
                                <Form.Select>

                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.name}>
                                            {categoria.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="BancosDespesa">
                                <Form.Label>Conta de banco:</Form.Label>
                                <Form.Select>

                                    {bancos.map((bancos) => (
                                        <option key={bancos.id} value={bancos.name}>
                                            {bancos.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="TipoDeCompra">
                                <Form.Label>Tipo de Compra:</Form.Label>
                                <Form.Select >
                                    <option value="Debito">Débito</option>
                                    <option value="Credito">Crédito</option>

                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="valorDinheiro">
                                <Form.Label>Valor:</Form.Label>
                                <Form.Control type="number" placeholder="R$ 00,00" />
                            </Form.Group>
                        </Form>
                        <div className="despesaPage">
                            <Button className="button" variant="danger" onClick={handleAddDespesa}>
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

export default CadDespesa;