import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../config/Firebase.ts';
import {
    Paper,
    Typography,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatistiquesChart: React.FC = () => {
    const [nbClients, setNbClients] = useState<number>(0);
    const [nbMedecins, setNbMedecins] = useState<number>(0);
    const [nbFeedbacks, setNbFeedbacks] = useState<number>(0);
    const [nbProtestations, setNbProtestations] = useState<number>(0);
    const [nbInfoDocs, setNbInfoDocs] = useState<number>(0);
    const [messageStats, setMessageStats] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loginSnap = await getDocs(collection(firestore, 'login'));
                const logindSnap = await getDocs(collection(firestore, 'logind'));
                const feedSnap = await getDocs(collection(firestore, 'feed'));
                const protestSnap = await getDocs(collection(firestore, 'protestation'));
                const infoSnap = await getDocs(collection(firestore, 'info'));

                setNbClients(loginSnap.size);
                setNbMedecins(logindSnap.size);
                setNbFeedbacks(feedSnap.size);
                setNbProtestations(protestSnap.size);
                setNbInfoDocs(infoSnap.size);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const days: string[] = [];
                const messageCount: { [key: string]: number } = {};

                for (let i = 9; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    days.push(dateStr);
                    messageCount[dateStr] = 0;
                }

                const messengerSnap = await getDocs(collection(firestore, 'messenger'));
                messengerSnap.forEach(doc => {
                    const data = doc.data();
                    let timestamp: Date | null = null;

                    if (data.timestamps?.toDate) {
                        timestamp = data.timestamps.toDate();
                    } else if (typeof data.timestamps === 'string') {
                        const cleaned = data.timestamps
                            .replace('à', '')
                            .replace('UTC+1', '+0100');
                        timestamp = new Date(cleaned);
                    }

                    if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
                        timestamp.setHours(0, 0, 0, 0);
                        const dateStr = timestamp.toISOString().split('T')[0];
                        if (messageCount[dateStr] !== undefined) {
                            messageCount[dateStr]++;
                        }
                    }
                });

                setMessageStats({
                    labels: days,
                    data: days.map(day => messageCount[day]),
                });

            } catch (error) {
                console.error('Erreur lors de la récupération des données Firestore :', error);
            }
        };

        fetchData();
    }, []);

    const utilisateursData = {
        labels: ['Utilisateurs'],
        datasets: [
            {
                label: 'Nombre de Clients',
                data: [nbClients],
                backgroundColor: '#3f51b5',
            },
            {
                label: 'Nombre de Médecins',
                data: [nbMedecins],
                backgroundColor: '#f50057',
            },
        ],
    };

    const feedbackData = {
        labels: ['Interactions'],
        datasets: [
            {
                label: 'Nombre de Feedbacks',
                data: [nbFeedbacks],
                backgroundColor: '#4caf50',
            },
            {
                label: 'Nombre de Protestations',
                data: [nbProtestations],
                backgroundColor: '#ff9800',
            },
        ],
    };

    const messagesData = {
        labels: messageStats.labels,
        datasets: [
            {
                label: 'Messages par jour',
                data: messageStats.data,
                backgroundColor: '#2196f3',
            },
        ],
    };

    const infoData = {
        labels: ['Documents info'],
        datasets: [
            {
                label: 'Nombre de documents',
                data: [nbInfoDocs],
                backgroundColor: '#9c27b0',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: false },
        },
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">ANALYTICS</Typography>
                    <Button color="inherit" component={Link} to="/Chatbot" sx={{ marginLeft: 'auto' }}>
                        Return
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: 5, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Statistiques utilisateurs
                            </Typography>
                            <Bar
                                data={utilisateursData}
                                options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'NOMBRE DES CLIENTS' } } }}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Statistiques interactions
                            </Typography>
                            <Bar
                                data={feedbackData}
                                options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'FEEDBACK VS PROTESTATION' } } }}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Messages sur les 10 derniers jours
                            </Typography>
                            <Bar
                                data={messagesData}
                                options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'MESSAGES PAR JOUR' } } }}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Documents dans la collection "info"
                            </Typography>
                            <Bar
                                data={infoData}
                                options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'DOCUMENTS INFO' } } }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default StatistiquesChart;
