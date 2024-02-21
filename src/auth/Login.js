import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Col, Container, Form, Row, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import { app } from "../database/firebaseconfig";

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
    
 
    <Card className="my-5">
        <Card.Body>
        <Row >
      <Col className="mb-3 px-5 col-md-5 mx-auto">
        <h1>Login</h1>
      </Col>
   
    </Row>
        <Form>
        <Form.Group className="mb-3 px-5 col-md-5 mx-auto" controlId="formBasicEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
         
        </Form.Group>

        <Form.Group className="mb-3 px-5 col-md-5 mx-auto" controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Col lg='4' xs='9' className="mb-5 col-md-5 mx-auto">
          <Row >
          <Col>       
          <Button variant="success"  onClick={handleSubmit}>
            Entrar
          </Button>
          </Col>
          <Col>       
          <Button variant="secondary" onClick={UserCreateModalShow}>
            Criar Usuario
          </Button>
          </Col>
          </Row>
        </Col>

        

      </Form>
        </Card.Body>
    </Card>
     

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Erro ao entrar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          E-mail ou senha incorreta, por favor tente novamente
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={UserCreateModal} onHide={UserCreateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Usuario novo usuário</Modal.Title>
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