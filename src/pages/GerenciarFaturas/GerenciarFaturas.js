import { Card, Container, Row } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../database/firebaseconfig";
import { collection, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
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



// eslint-disable-next-line
    const [bankName, setBankName] = useState("");

    const [valorFatura, setValorFatura] = useState(0);



    const handlePagarFatura = async () => {
        const bankName = document.getElementById("bankNameSelect").value || "";
        const faturaName = document.getElementById("faturaNameSelect").value || "";

        if (!user || !bankName || !faturaName) return;

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
                    despesaName: "Fatura de cartão",
                });

                // Exclui a fatura selecionada
                const faturasCollectionRef = collection(db, "faturas");
                const querySnapshot = await getDocs(query(faturasCollectionRef, where("uid", "==", user.uid), where("banco", "==", faturaName)));

                if (!querySnapshot.empty) {
                    const faturaRef = querySnapshot.docs[0].ref;
                    await deleteDoc(faturaRef);

                    // Atualiza localmente a lista de faturas
                    setFaturas((prevFaturas) => prevFaturas.filter((fatura) => fatura.banco !== faturaName));

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


            <Container className="cont pb-3">

                <Row>
                    <p className="topTitle">Pagar faturas</p>
                </Row>

                <Card>
                    <Card.Body className="pb-5">
                        <Form>


                            <Form.Group className="mb-3" controlId="faturaNameSelect">

                                <Form.Label>Qual fatura quer pagar?</Form.Label>
                                <Form.Select>



                                    <option>Selecione a fatura</option>
                                    {faturas.map((fatura, index) => (
                                        <option key={index} value={fatura.banco}>
                                            {fatura.banco} - R$ {fatura.valor}
                                        </option>
                                    ))}
                                </Form.Select>

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="bankNameSelect">

                                <Form.Label>Pagar com saldo de:</Form.Label>
                                <Form.Select>

                                    <option>Selecione um banco</option>
                                    {bancos.map((banco, index) => (
                                        <option key={index} value={banco.name}>
                                            {banco.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <div className="btnGF ">
                                <Button variant="success" onClick={handlePagarFatura}>Pagar fatura</Button>
                            </div>
                        </Form>

                        
                    </Card.Body>
                </Card>

            </Container>
            <Footer />
        </>
    );
};

export default GerenciarFaturas;