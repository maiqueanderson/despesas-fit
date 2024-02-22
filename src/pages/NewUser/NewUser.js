
import { Card, Container, Form } from 'react-bootstrap'
import './NewUser.css'
import newUserImage from '../../assets/newUser.png'

const NewUser = () => {
    return (
        <>
            <Container className='cardBody'>
                <Card className=' my-3'>
                    <Card.Body>
                        <div className='introNew'>
                            <img className='mb-3' src={newUserImage} height={250} alt="despesaPage" />
                            <p className='newTitle'>Bem vindo ao Despesas FIT</p>
                        </div>


                        <Form>
                                <Form.Group className="mb-3 px-5 col-md-5 mx-auto" controlId="formBasicEmail">
                                    <Form.Label>Cadastre sua conta de Banco</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nome do Banco"
                                        // onChange={(e) => setEmail(e.target.value)}
                                    />

                                </Form.Group>
                            </Form>
                    </Card.Body>
                </Card>
            </Container>

        </>
    )
}

export default NewUser;