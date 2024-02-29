import './PagarContas.css'

import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where, updateDoc, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { app, db } from "../../database/firebaseconfig";

import receitaPage from '../../assets/receitaPage.png'

const PagarContas = () => {


    const navigate = useNavigate();

    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);

    const [contas, setContas] = useState([]);
    const [bancos, setBancos] = useState([]);
    const [contaValor, setContaValor] = useState(0);


    const [contaSelect, setContaSelect] = useState('');


    const [bancoSelect, setBancoSelect] = useState('');



    const handlePagarContas = async () => {
        const contaSelect = document.getElementById("ContaAPagar").value;
        const bancoSelect = document.getElementById("BancosDespesa").value;
        const valor = contaValor;
    
        if (!contaSelect || !bancoSelect || !valor) return;
    
        try {
            // Consultar o documento da categoria selecionada para obter a cor
            const catQuery = query(collection(db, "paraPagar"), where("despesaName", "==", contaSelect));
            const contaSnapshot = await getDocs(catQuery);
    
            if (!contaSnapshot.empty) {
    
                // Subtrair o valor da despesa do saldoCorrente do banco selecionado
                const bancosCollectionRef = collection(db, "bancos");
                const bancosQuery = query(bancosCollectionRef, where("name", "==", bancoSelect));
                const bancosSnapshot = await getDocs(bancosQuery);
    
                if (!bancosSnapshot.empty) {
                    // Verifica se a coleção não está vazia
                    const bancoDoc = bancosSnapshot.docs[0];
                    const saldoCorrenteAtual = parseFloat(bancoDoc.data().saldoCorrente);
                    const novoSaldoCorrente = saldoCorrenteAtual - parseFloat(valor);
    
                    // Atualizar o saldoCorrente no banco selecionado
                    await updateDoc(bancoDoc.ref, {
                        saldoCorrente: novoSaldoCorrente,
                    });
    
                    console.log("Receita adicionada com sucesso!");
    
                    // Obter os dados do documento paraPagar
                    const paraPagarDoc = contaSnapshot.docs[0].data();
    
                    // Adicionar um documento à coleção despesas com os dados do documento paraPagar
                    await addDoc(collection(db, "despesas"), paraPagarDoc);
    
                    // Deletar o documento da coleção paraPagar correspondente ao despesaName selecionado
                    const docToDeleteQuery = query(collection(db, "paraPagar"), where("despesaName", "==", contaSelect));
                    const docToDeleteSnapshot = await getDocs(docToDeleteQuery);
    
                    if (!docToDeleteSnapshot.empty) {
                        const docToDelete = docToDeleteSnapshot.docs[0];
                        await deleteDoc(docToDelete.ref);
                        console.log("Documento deletado com sucesso!");
                    }
    
                    // Limpar os campos após a adição
                    document.getElementById("ContaAPagar").value = "";
                    document.getElementById("BancosDespesa").value = "";
    
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

        const paraPagarCollectionRef = collection(db, "paraPagar");
        const paraPagarQuery = query(paraPagarCollectionRef, where("uid", "==", user.uid));
        const unsubscribe = onSnapshot(paraPagarQuery, (snapshot) => {
            const paraPagarData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContas(paraPagarData);
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
            <div className="nav3">

            </div>

            <Container className="cardBody">

                <Card className="cardDespesa">
                    <Card.Body>
                        <div className="despesaPage">
                            <img src={receitaPage} height={80} alt="despesaPage" />
                            <p className="title my-2">Pagar Contas</p>
                        </div>

                        <Form>

                            <Form.Group className="my-3" controlId="ContaAPagar">
                                <Form.Label>Selecione a conta à pagar:</Form.Label>
                                <Form.Select
                                    value={contaSelect}
                                    onChange={(e) => {
                                        setContaSelect(e.target.value);
                                        const selectedConta = contas.find((conta) => conta.despesaName === e.target.value);
                                        if (selectedConta) {
                                            setContaValor(selectedConta.valor);
                                            
                                        }
                                    }}
                                >   
                                    <option>Selecione uma conta</option>
                                    {contas.map((conta) => (
                                        <option key={conta.id} value={conta.despesaName}>
                                            {conta.despesaName} - R$ {conta.valor}
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


                        </Form>
                        <div className="despesaPage">
                            <Button className="button" variant="success" onClick={handlePagarContas}>
                                Pagar
                            </Button>
                        </div>

                    </Card.Body>
                </Card>

            </Container>
            <Footer />
        </>


    )
}

export default PagarContas;