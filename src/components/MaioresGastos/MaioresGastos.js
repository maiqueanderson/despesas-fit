
import { Card, Container, Row, Col } from "react-bootstrap";
import "./MaioresGastos.css";

import React, { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import { getDocs, collection, query, where } from "firebase/firestore";

const MaioresGastos = () => {
    const [maioresGastos, setMaioresGastos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Calcular o primeiro e último dia do mês atual
            const hoje = new Date();
            const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

            // Consulta para obter todas as despesas do mês atual
            const q = query(collection(db, "despesas"), where("date", ">=", primeiroDiaDoMes), where("date", "<=", ultimoDiaDoMes));
            const querySnapshot = await getDocs(q);

            // Mapear os documentos e extrair as categorias e valores das despesas
            const despesas = querySnapshot.docs.map(doc => ({
                categoria: doc.data().categoria,
                valor: doc.data().valor
            }));

            // Agrupar e somar os valores das despesas por categoria
            const gastosPorCategoria = despesas.reduce((acc, curr) => {
                acc[curr.categoria] = (acc[curr.categoria] || 0) + parseFloat(curr.valor);
                return acc;
            }, {});

            // Classificar as categorias pelos maiores gastos
            const maioresGastos = Object.entries(gastosPorCategoria)
                .sort((a, b) => b[1] - a[1])
                .map(([categoria, valor]) => ({ categoria, valor }));

            setMaioresGastos(maioresGastos);
        };

        fetchData();
    }, []);

    return (
        <Container className="cardBody py-3">
            <Card>
                <Card.Body>
                    <Row>
                        <p className="titleText">Maiores gastos do mês</p>
                    </Row>
                    {maioresGastos.map((gasto, index) => (
                        <Row key={index}>
                            <Col xs={8}>
                                <p>{gasto.categoria}</p>
                            </Col>
                            <Col xs={4}>
                                <p className="porc">R$ {gasto.valor.toFixed(2)}</p>
                            </Col>
                        </Row>
                    ))}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MaioresGastos;
