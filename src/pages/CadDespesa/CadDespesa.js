import { Button, Card, Container, Form } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";

import './CadDespesa.css'
import despesaPage from '../../assets/despesaPage.png'

const CadDespesa = () => {
    return (
        <>
        
        <Container className="cardBody pb-3">

            <Card className="my-5">
                <Card.Body>
                    <div className="despesaPage">
                        <img src={despesaPage} height={80} alt="despesaPage" />
                        <p className="titleD my-2">Cadastrar Despesa</p>
                    </div>

                    <Form>
                        <Form.Group className="mb-3" controlId="CategoriaDespesa">
                            <Form.Label>Categoria:</Form.Label>
                            <Form.Select >
                                <option>Escolha a categoria da despesa</option>
                                <option value="Alimentação">Alimentação</option>
                                <option value="Saúde">Saúde</option>
                                <option value="Diversão">Diversão</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="ContaDoBanco">
                            <Form.Label>Conta do Banco:</Form.Label>
                            <Form.Select >
                                <option>Escolha onde foi feita a despesa</option>
                                <option value="Inter">Inter</option>
                                <option value="Nubank">Nubank</option>
                                <option value="Mercado Pago">Mercado Pago</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="TipoDeCompra">
                            <Form.Label>Tipo de Compra:</Form.Label>
                            <Form.Select >
                                <option>Escolha débito ou crédito</option>
                                <option value="Débito">Débito</option>
                                <option value="1">Crédito 1X</option>
                                <option value="2">Crédito 2X</option>
                                <option value="3">Crédito 3X</option>
                                <option value="4">Crédito 4X</option>
                                <option value="5">Crédito 5X</option>
                                <option value="6">Crédito 6X</option>
                                <option value="7">Crédito 7X</option>
                                <option value="8">Crédito 8X</option>
                                <option value="9">Crédito 9X</option>
                                <option value="10">Crédito 10X</option>
                                <option value="11">Crédito 11X</option>
                                <option value="12">Crédito 12X</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group  className="mb-3" controlId="valorDinheiro">
                            <Form.Label>Valor:</Form.Label>
                            <Form.Control type="number" placeholder="R$ 00,00" />
                        </Form.Group>
                    </Form>
                    <div className="despesaPage">
                        <Button className="button" variant="danger">Cadastrar</Button>
                    </div>
                </Card.Body>
            </Card>

        </Container>
        <Footer/>
        </>

       
    )
}

export default CadDespesa;