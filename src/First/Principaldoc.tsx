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
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../config/Firebase.ts";
import emailjs from "emailjs-com";

const drawerWidth = 240;

const Sidebar: React.FC = () => (
    <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                backgroundColor: "#212529",
                color: "#fff",
            },
        }}
    >
        <Toolbar />
        <List>

            <ListItemButton component={Link} to="/settings">
                <ListItemIcon><SettingsIcon style={{ color: "#fff" }} /></ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItemButton>
        </List>
    </Drawer>
);

// ... (imports identiques)

const Principaldoc: React.FC = () => {
    const navigate = useNavigate();
    const [nomdoc, setNomdoc] = useState<string>("");
    const [emaildoc, setEmaildoc] = useState<string | null>(null);

    const [users, setUsers] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const storedNom = localStorage.getItem("nomdoc");
        const emaildoc = localStorage.getItem("emaildoc");
        if (storedNom) {
            setNomdoc(storedNom);


        } else {
            navigate("/");
        }
        setEmaildoc(emaildoc)

        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(firestore, "login"));
            const data = querySnapshot.docs.map((doc) => doc.data());
            setUsers(data);
        };

        fetchUsers();
    }, [navigate]);

    const handleOpenDialog = () => {
        setEmail("");       // Champ email vide à l'ouverture
        setMessage("");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEmail("");
        setMessage("");
    };

    const handleSendEmail = () => {
        if (email && message) {
            const templateParams = {
                to: email,
                message,
            };

            const userId = "VTgiHANHc3BjDhH2O";

            emailjs
                .send("service_0zl6jng", "template_h654808", templateParams, userId)
                .then((response) => {
                    console.log("Email sent successfully:", response);
                    handleCloseDialog();
                })
                .catch((error) => {
                    console.error("Error sending email:", error);
                });
        } else {
            alert("Please fill in both the email and the message.");
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: "20px" }}>
                <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            DOCTOR Dashboard
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            component="a"
                            href="/third"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live meet
                        </Button>
                        <Box sx={{ mx: 3 }} />
                        <Button
                            variant="contained"
                            color="secondary"
                            component="a"
                            href="/Doctor"


                        >
                            Form
                        </Button>
                        <Box sx={{ mx: 3 }} />
                        <Button
                            variant="contained"
                            color="secondary"
                            component="a"
                            href="/Progress"


                        >
                            Evaluation
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Hello {nomdoc} {emaildoc} 👋
                    </Typography>
                    <Grid container spacing={2}>
                        {users.map((user, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card onClick={handleOpenDialog} sx={{ cursor: "pointer" }}>
                                    <CardContent>
                                        <Typography variant="h6">Nom: {user.nom}</Typography>
                                        <Typography color="textSecondary">EMAIL: {user.email}</Typography>
                                        <Typography color="textSecondary">NOM: {user.adresse}</Typography>
                                        <Typography color="textSecondary">AGE: {user.ageEnfant}</Typography>
                                        <Typography color="textSecondary">NUMBER: {user.nombreFils}</Typography>
                                        <Typography color="textSecondary">PHONE: {user.numeroTelephone}</Typography>
                                        <Typography color="textSecondary">COUNTREY: {user.pays}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Send Email</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Message"
                            multiline
                            rows={4}
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSendEmail} variant="contained" color="primary">
                            Send
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default Principaldoc;
