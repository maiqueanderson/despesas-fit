import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app, db } from "../../database/firebaseconfig";
import {
    doc,
    getDoc,
  } from "firebase/firestore";

import Header from "../../components/Header/Header"
import Popupanca from "../../components/Poupanca/Poupanca"
import ContaCorrente from '../../components/ContaCorrente/ContaCorrente'
import Footer from "../../components/Footer/Footer"
import MaioresGastos from "../../components/MaioresGastos/MaioresGastos"
import Metas from '../../components/Metas/Metas'
import Faturas from "../../components/Faturas/Faturas"
import ContasAPagar from "../../components/ContasAPagar/ContasAPagar"
import Receber from "../../components/Receber/Receber";
import { Col, Container, Row, Button } from "react-bootstrap"

import './Home.css'

const Home = () => {
  // eslint-disable-next-line
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  // eslint-disable-next-line
  const [userBankData, setUserBankData] = useState(null);
  const navigate = useNavigate();

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
        } catch (error) {
          console.error("Erro ao buscar dados de usuário no Firestore:", error);
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();

  }, [navigate]);

  const handleSignOut = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log("Usuário desconectado");
        navigate("/"); // Redireciona para a página de login
      })
      .catch((error) => {
        console.error("Erro ao desconectar usuário:", error);
      });
  };

    return (
        <>
          <div className="nav">          
              
          </div>
          <Footer />
          <Container className="cont">
            <Row>
              <p className="welcome mb-0">Bem Vindo</p>
            </Row>
            <Row>
              <p className="userName">{userData?.name}</p>
             
            </Row>
            <Header />
            <Row>
              <Col lg={6} xs={12}>
                <Row>
                  <ContaCorrente />
                </Row>
                <Popupanca />
                <Row>
                  <ContasAPagar/>
                </Row>
                <Row>
                  <Receber/>
                </Row>
              </Col>
              <Col lg={6} xs={12}>
                <Row>
                  <MaioresGastos />
                </Row>
                <Row>
                  <Metas />
                </Row>
                <Row>
                  <Faturas />
                </Row>
              </Col>
            </Row>
            <Row>
            <Button className="mb-5 pb-5" variant="danger" onClick={handleSignOut}>Sair</Button>
            </Row>
          </Container>
        </>
    );
};

export default Home;
