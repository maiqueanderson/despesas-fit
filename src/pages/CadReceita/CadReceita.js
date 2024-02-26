import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import './CadReceita.css'
import receitaPage from '../../assets/receitaPage.png'

const CadReceita = () => {
    return (
        <>
         <div className="nav3">          
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
                    </div>

                    <Form>
                        <Form.Group className="mb-3" controlId="CategoriaDespesa">
                            <Form.Label>Categoria:</Form.Label>
                            <Form.Select >
                                <option>Escolha a categoria da receita</option>
                                <option value="Salário">Salário</option>
                                <option value="Comissão">Comissão</option>
                                <option value="Venda">Venda</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="ContaDoBanco">
                            <Form.Label>Conta do Banco:</Form.Label>
                            <Form.Select >
                                <option>Escolha onde será adicionado a receita</option>
                                <option value="Inter">Inter</option>
                                <option value="Nubank">Nubank</option>
                                <option value="Mercado Pago">Mercado Pago</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="TipoDeCompra">
                            <Form.Label>Tipo de conta:</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option>Escolha conta corrente ou poupança</option>
                                <option value="Conta Corrente">Conta Corrente</option>
                                <option value="Poupança">Poupança</option>
                               
                            </Form.Select>
                        </Form.Group>

                        <Form.Group  className="mb-3" controlId="valorDinheiro">
                            <Form.Label>Valor:</Form.Label>
                            <Form.Control type="number" placeholder="R$ 00,00" />
                        </Form.Group>
                    </Form>
                    <div className="despesaPage">
                        <Button className="button" variant="success">Cadastrar</Button>
                    </div>
                </Card.Body>
            </Card>

        </Container>
        <Footer/>
        </>

       
    )
}

export default CadReceita;