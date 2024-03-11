import React, { useEffect, useRef, useState } from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import Chart from 'chart.js/auto';
import { app, db } from '../../database/firebaseconfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
import './Graficos.css'

const Graficos = () => {
    const chartRef = useRef(null);

    const [user, setUser] = useState(null);
    const [receitas, setReceitas] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                console.error("Usuário não autenticado.");
                return;
            }

            if (!user.uid) {
                console.error("UID do usuário inválido.");
                return;
            }

            const qReceitas = query(collection(db, 'receitas'), where('uid', '==', user.uid));
            const qDespesas = query(collection(db, 'despesas'), where('uid', '==', user.uid));
            const receitasSnapshot = await getDocs(qReceitas);
            const despesasSnapshot = await getDocs(qDespesas);
            const receitasData = receitasSnapshot.docs.map(doc => doc.data());
            const despesasData = despesasSnapshot.docs.map(doc => doc.data());
            setReceitas(receitasData);
            setDespesas(despesasData);
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                const userDocRef = doc(db, "users", user.uid);

                try {
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        // setUserData(userDocSnapshot.data());
                    } else {
                        console.log("Documento de usuário não encontrado no Firestore.");
                        console.log(userDocSnapshot);
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados de usuário no Firestore:", error);
                }
            }
        });

        return () => unsubscribe();

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (receitas.length > 0 && despesas.length > 0) {
            const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const anoAtual = new Date().getFullYear();
            const receitasPorMes = labels.map((mes, index) => {
                const mesIndex = index + 1; // Mês começa em 1 no JavaScript
                return receitas.reduce((total, receita) => {
                    const date = receita.date.toDate();
                    return date.getFullYear() === anoAtual && date.getMonth() + 1 === mesIndex ? total + parseFloat(receita.valor) : total;
                }, 0);
            });

            const despesasPorMes = labels.map((mes, index) => {
                const mesIndex = index + 1; // Mês começa em 1 no JavaScript
                return despesas.reduce((total, despesa) => {
                    const date = despesa.date.toDate();
                    return date.getFullYear() === anoAtual && date.getMonth() + 1 === mesIndex ? total + parseFloat(despesa.valor) : total;
                }, 0);
            });

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Receitas',
                        data: receitasPorMes,
                        fill: false,
                        borderColor: '#408558',
                        tension: 0.1
                    },
                    {
                        label: 'Despesas',
                        data: despesasPorMes,
                        fill: false,
                        borderColor: 'rgb(192, 75, 75)',
                        tension: 0.1
                    }
                ]
            });
        }
    }, [receitas, despesas]);

    useEffect(() => {
        let myChart = chartRef.current;

        if (myChart) {
            myChart.destroy();
        }

        if (chartData) {
            const ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: chartData
            });

            chartRef.current = myChart;
        }
    }, [chartData]);

    return (
        <>
            <div className="nav"></div>
            <Footer/>
                
            <Container className="cont pb-5 mb-5">
                <Row>
                    <p className="topTitle">Gráficos</p>
                </Row>
                <Card>
                    <Card.Body>
                        <Row>
                            <div>

                            <p className='graficTitle'>Receitas e despesas do ano</p>
                            </div>
                        </Row>
                        <canvas id="myChart" width="400" height="400"></canvas>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Graficos;
