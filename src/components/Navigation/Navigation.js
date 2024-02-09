import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png'
import { Link } from "react-router-dom";
import './Navigation.css';

const Navigation = () =>{
    return(
            <Navbar bg="success" expand="lg">
      <Container fluid>
        <Navbar.Brand className="my-3 mx-5 p-3">
        <Link to='./'>
        <img src={logo} height={80} className='d-inline-block align-top' alt='Anilox Design' />
        </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 mx-5"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link className="mx-3 nav_link" to='./' >Sobre Nós</Link>
            <Link className="mx-3 nav_link" to='./' >Serviços</Link>
            <Link className="mx-3 nav_link" to='./' >Portfólio</Link>
           
          
        
            
      
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
        )
}

export default Navigation;
   