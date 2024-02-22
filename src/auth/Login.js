import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Container, Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import './Login.css'
import { app } from "../database/firebaseconfig";
import imageLogin from '../assets/newUser.png'
import logo from '../assets/logo2.png'
import UserCreate from "../auth/UserCreate";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [UserCreateModal, setUserCreateModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const UserCreateModalShow = () => setUserCreateModal(true);
  const UserCreateClose = () => setUserCreateModal(false);

  const handleSubmit = async () => {
    try {
      const auth = getAuth(app);
      const data = await signInWithEmailAndPassword(auth, email, password);
      console.log(data);
      // Redireciona o usuário para a página de dashboard após o login bem-sucedido

      navigate("/Home");
    } catch (error) {
      console.log("err", error);
      handleShow();
    }
  };

  return (
    <>
      <Container>
      <div className="logo my-2">
          <img className=" my-3" src={logo} height={30} alt="Despesas FIT" />
        </div>
        <div className="LogoLogin">
        <img className="mb-3" src={imageLogin} height={280} alt="Despesas FIT" />
        </div>
        <div className="LogoLogin">
          <p className="titleLogin">Todas as suas contas e cartões em <span className="titleLogin2">um só lugar</span></p>
        </div>
        <Form>
          <Form.Group className="mb-3 px-5 col-md-5 mx-auto" controlId="formBasicEmail">
        
            <Form.Control
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />

          </Form.Group>

          <Form.Group className="mb-3 px-5 col-md-5 mx-auto" controlId="formBasicPassword">

            <Form.Control
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>


          <Row className="py-2" >

            <div className="buttonL">

              <Button className="buttonLogin" variant="success" onClick={handleSubmit}>
                Entrar
              </Button>
            </div>
          </Row>

          <Row className="mb-2" >
            <div className="buttonL">

              <Button className="buttonCreate" onClick={UserCreateModalShow}>
                Não tem conta? <span className="titleLogin2">Cadastre-se</span>
              </Button>
            </div>

          </Row>




        </Form>


        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Erro ao entrar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            E-mail ou senha incorreta, por favor tente novamente
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={UserCreateModal} onHide={UserCreateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Criar uma conta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UserCreate />
          </Modal.Body>
        </Modal>

      </Container>
    </>
  );
};

export default Login;