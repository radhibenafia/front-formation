import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    AppBar,
    Toolbar,
    Button,
    Box,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Paper,
    CircularProgress,
    Grid,
    Card,
    CardContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from 'react-router-dom';
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../config/Firebase.ts";

const drawerWidth = 240;

const Sidebar: React.FC = () => (
    <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#212529',
                color: '#fff',
            },
        }}
    >
        <Toolbar />
        <List>
            <ListItemButton component={Link} to="/">
                <ListItemIcon><DashboardIcon style={{ color: '#fff' }} /></ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} to="/analytics">
                <ListItemIcon><BarChartIcon style={{ color: '#fff' }} /></ListItemIcon>
                <ListItemText primary="Analytics" />
            </ListItemButton>

        </List>
    </Drawer>
);

const Profil: React.FC = () => {
    const navigate = useNavigate();
    const [nomParent, setNomParent] = useState<string>("");
    const [users, setUsers] = useState<Array<{ email: string; nom: string }>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedNom = localStorage.getItem("nomparent");
        if (storedNom) {
            setNomParent(storedNom);

            const fetchAllUsers = async () => {
                try {
                    const snapshot = await getDocs(collection(firestore, "logind"));
                    const usersData = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            email: data.email ?? "N/A",
                            nom: data.nom ?? "N/A",
                        };
                    });
                    setUsers(usersData);
                } catch (error) {
                    console.error("Erreur Firebase :", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchAllUsers();
        } else {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flexGrow: 1, padding: "20px" }}>
                <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            PARENT ACCOUNT
                        </Typography>
                        <Button variant="contained" color="secondary" component={Link} to="/third">
                            Live meet
                        </Button>
                        <Box sx={{ mx: 2 }} />
                        <Button variant="contained" color="secondary" component={Link} to="/Game2">
                            web game
                        </Button>
                        <Box sx={{ mx: 2 }} />
                        <Button variant="contained" color="secondary" component={Link} to="/Test">
                            Ai game
                        </Button>
                        <Box sx={{ mx: 2 }} />
                        <Button variant="contained" color="secondary" component={Link} to="/Posenetgame">
                            Hand detection
                        </Button>
                        <Box sx={{ mx: 2 }} />
                        <Button variant="contained" color="secondary" component={Link} to="/Game3">
                            ASK AI
                        </Button>
                        <Box sx={{ mx: 2 }} />
                        <Button variant="contained" color="secondary" component={Link} to="/Rapport">
                            firebase rapport
                        </Button>
                        <Button variant="contained" color="secondary" component={Link} to="/Facebook">
                            SpeechRecognition
                        </Button>

                    </Toolbar>
                </AppBar>

                <Container sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Hello {nomParent} 👋
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: "gray" }}>
                        Liste de tous les comptes :
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Grid container spacing={2}>
                            {users.map((user, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6">{user.nom}</Typography>
                                            <Typography color="text.secondary">{user.email}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default Profil;
