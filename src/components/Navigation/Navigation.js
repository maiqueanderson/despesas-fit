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
      <Container  >
        <Navbar.Brand className="logo" >
        <Link to='./'>
        <img src={logo} height={40} className='d-inline-block align-center logo' alt='Despesas FIT' />
        </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            
            style={{ maxHeight: '100px' }}
            navbarScroll
            
          >
            <Link className="mx-3 nav_link" to='./' >listas</Link>
            <Link className="mx-3 nav_link" to='./' >lançamentos</Link>
            <Link className="mx-3 nav_link" to='./' >relatórios</Link>
            <Link className="mx-3 nav_link" to='./' >metas</Link>
           
          
        
            
      
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
        )
}

export default Navigation;
   