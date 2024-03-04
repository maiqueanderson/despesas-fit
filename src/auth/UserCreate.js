import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { app, db } from "../database/firebaseconfig";
import { Container, Form, Button } from "react-bootstrap";

const UserCreate = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    const auth = getAuth(app);
    try {
      const dataUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (dataUser) {
        try {
          const usersRef = collection(db, "users");
          await setDoc(doc(usersRef, auth.currentUser.uid), {
            name,
            email,
            uid: auth.currentUser.uid,
          });

          const usersBank = collection(db, "bancos");
          await setDoc(doc(usersBank, auth.currentUser.uid), {
            name: 'Conta inicial',
            saldoCorrente: '0,00',
            saldoPoupanca: '0,00',
            limiteCartao: '0,00',
            cor: '#408558',
            uid: auth.currentUser.uid,
          });

          const usersReceita = collection(db, "categorias");
          await setDoc(doc(usersReceita, auth.currentUser.uid), {
            cor: '#2b1212',
            name: 'Cartão de crédito',
            uid: auth.currentUser.uid,
          });


          navigate("/Home"); // Redirecionar para a rota '/Home' após o cadastro bem-sucedido
        } catch (err) {
          console.log("errDoc: ", err);
        }
      }
    } catch (err) {
      console.log("errUser: ", err);
    }
  };



  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>E-mail:</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-mail do cliente"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha do Cliente"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <p>Ao clicar em Cadastre-se, você concorda com nossos <Link to={'/'}>Termos de uso</Link></p>
        <Button variant="success" onClick={handleSubmit}>Cadastra-se</Button>
      </Form>
    </Container>
  );
};

export default UserCreate;