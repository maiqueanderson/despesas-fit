import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where, updateDoc, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { app, db } from "../../database/firebaseconfig";

const ReceberValor = () => {

    const navigate = useNavigate();
    // eslint-disable-next-line
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [contas, setContas] = useState([]);
    const [bancos, setBancos] = useState([]);
    const [contaSelect, setContaSelect] = useState('');
    const [bancoSelect, setBancoSelect] = useState('');
    const [valorAReceber, setValorAReceber] = useState('');

    const handleReceberValor = async () => {
        const contaSelect = document.getElementById("ContaAReceber").value;
        const bancoSelect = document.getElementById("BancosReceita").value;
        const valor = parseFloat(valorAReceber);

        if (!contaSelect || !bancoSelect || !valor) return;

        try {
            const catQuery = query(collection(db, "paraReceber"), where("categoria", "==", contaSelect));
            const contaSnapshot = await getDocs(catQuery);

            if (!contaSnapshot.empty) {
                const bancosCollectionRef = collection(db, "bancos");
                const bancosQuery = query(bancosCollectionRef, where("name", "==", bancoSelect));
                const bancosSnapshot = await getDocs(bancosQuery);

                if (!bancosSnapshot.empty) {
                    const bancoDoc = bancosSnapshot.docs[0];
                    const saldoCorrenteAtual = parseFloat(bancoDoc.data().saldoCorrente);
                    const novoSaldoCorrente = saldoCorrenteAtual + valor;

                    await updateDoc(bancoDoc.ref, {
                        saldoCorrente: novoSaldoCorrente,
                    });

                    console.log("Receita adicionada com sucesso!");

                    // Obter os dados do documento paraPagar
                    const receberDoc = contaSnapshot.docs[0].data();
    
                    // Adicionar um documento à coleção despesas com os dados do documento paraPagar
                    await addDoc(collection(db, "receitas"), receberDoc);

                    const docToDeleteQuery = query(collection(db, "paraReceber"), where("categoria", "==", contaSelect));
                    const docToDeleteSnapshot = await getDocs(docToDeleteQuery);

                    if (!docToDeleteSnapshot.empty) {
                        const docToDelete = docToDeleteSnapshot.docs[0];
                        await deleteDoc(docToDelete.ref);
                        console.log("Documento deletado com sucesso!");
                    }

                    document.getElementById("ContaAReceber").value = "";
                    document.getElementById("BancosReceita").value = "";
                    setValorAReceber("");

                    navigate("/Home");
                } else {
                    console.error("Documento de banco não encontrado no Firestore.");
                }
            } else {
                console.error("Documento de categoria não encontrado no Firestore.");
            }
        } catch (error) {
            console.error("Erro ao adicionar receita:", error);
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

    }, []);

    useEffect(() => {
        if (!user) return;

        const paraReceberCollectionRef = collection(db, "paraReceber");
        const paraReceberQuery = query(paraReceberCollectionRef, where("uid", "==", user.uid));
        const unsubscribe = onSnapshot(paraReceberQuery, (snapshot) => {
            const paraReceberData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContas(paraReceberData);
        });
        return () => unsubscribe();

    }, [user]);

    useEffect(() => {
        if (!user) return;

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
            <div className="nav">

            </div>

            <Container className="cardBody">

                <Card className="cardDespesa">
                    <Card.Body>
                        <div className="despesaPage">
                       
                            <p className="title my-2">Receber Valor</p>
                        </div>

                        <Form>

                            <Form.Group className="my-3" controlId="ContaAReceber">
                                <Form.Label>Selecione a conta a receber:</Form.Label>
                                <Form.Select
                                    value={contaSelect}
                                    onChange={(e) => {
                                        setContaSelect(e.target.value);
                                        const selectedConta = contas.find((conta) => conta.categoria === e.target.value);
                                        if (selectedConta) {
                                            setValorAReceber(selectedConta.valor);
                                        }
                                    }}
                                >
                                    <option>Selecione uma conta</option>
                                    {contas.map((conta) => (
                                        <option key={conta.id} value={conta.categoria}>
                                            {conta.categoria} - R$ {conta.valor}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="BancosReceita">
                                <Form.Label>Conta de banco:</Form.Label>
                                <Form.Select
                                    value={bancoSelect}
                                    onChange={(e) => setBancoSelect(e.target.value)}
                                >
                                    <option>Selecione um banco</option>
                                    {bancos.map((banco) => (
                                        <option key={banco.id} value={banco.name}>
                                            {banco.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                        </Form>
                        <div className="despesaPage">
                            <Button className="button" variant="success" onClick={handleReceberValor}>
                                Receber
                            </Button>
                        </div>

                    </Card.Body>
                </Card>

            </Container>
            <Footer />
        </>


    )
}

export default ReceberValor;
