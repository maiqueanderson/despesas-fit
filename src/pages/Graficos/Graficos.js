// Importe as bibliotecas necessárias e os estilos
import React, { useEffect, useRef, useState } from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import Chart from 'chart.js/auto';
import { app, db } from '../../database/firebaseconfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import './Graficos.css'

const Graficos = () => {
    const chartRef = useRef(null);

    const [user, setUser] = useState(null);
    const [receitas, setReceitas] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [doughnutData, setDoughnutData] = useState(null);
    const [pieData, setPieData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.uid) {
                console.error("Usuário não autenticado.");
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
            }
        });

        return () => unsubscribe();

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

            // Calcular os dados do gráfico de Doughnut
            const categoriasDespesasData = despesas.reduce((acc, despesa) => {
                if (!acc[despesa.categoria]) {
                    acc[despesa.categoria] = 0;
                }
                acc[despesa.categoria] += parseFloat(despesa.valor);
                return acc;
            }, {});

            setDoughnutData({
                labels: Object.keys(categoriasDespesasData),
                datasets: [{
                    label: 'Despesas por categoria',
                    data: Object.values(categoriasDespesasData),
                    backgroundColor: Object.keys(categoriasDespesasData).map(categoria => {
                        const despesa = despesas.find(d => d.categoria === categoria);
                        return despesa ? despesa.cor : '#000000'; // Caso não encontre a cor, retorna uma cor padrão
                    }),
                }],
            });

              // Calcular os dados do gráfico de 'pie' das receitas
              const categoriasReceitasData = receitas.reduce((acc, receita) => {
                if (!acc[receita.categoria]) {
                    acc[receita.categoria] = 0;
                }
                acc[receita.categoria] += parseFloat(receita.valor);
                return acc;
            }, {});

            setPieData({
                labels: Object.keys(categoriasReceitasData),
                datasets: [{
                    label: 'Receitas por categoria',
                    data: Object.values(categoriasReceitasData),
                    backgroundColor: Object.keys(categoriasReceitasData).map(categoria => {
                        const receita = receitas.find(r => r.categoria === categoria);
                        return receita ? receita.cor : '#000000'; // Caso não encontre a cor, retorna uma cor padrão
                    }),
                }],
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

    useEffect(() => {
        if (doughnutData) {
            const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
            new Chart(ctxDoughnut, {
                type: 'doughnut',
                data: doughnutData
            });
        }
    }, [doughnutData]);

    useEffect(() => {
        if (pieData) {
            const ctxPie = document.getElementById('pieChart').getContext('2d');
            new Chart(ctxPie, {
                type: 'pie',
                data: pieData
            });
        }
    }, [pieData]);

    return (
        <>
            <div className="nav"></div>
            <Footer />

            <Container className="cont pb-5 mb-5">
                <Row>
                    <p className="topTitle">Gráficos</p>
                </Row>
                <Card>
                    <Card.Body>
                        <Row className='py-3'>
                            <div>
                                <p className='graficTitle'>Receitas e despesas do ano</p>
                            </div>
                        
                        <canvas id="myChart" width="400" height="400"></canvas>

                        </Row>

                        <Row className='py-3'>
                            <div>
                                <p className='graficTitle'>Despesas por categoria</p>
                            </div>
                        
                        <canvas id="doughnutChart" width="400" height="400"></canvas>
                        </Row>

                        <Row className='py-3'>
                            <div>
                                <p className='graficTitle'>Receitas por categoria</p>
                            </div>
                        
                        <canvas id="pieChart" width="400" height="400"></canvas>
                        </Row>

                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Graficos;
