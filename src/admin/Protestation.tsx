import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Paper,
    Typography,
    Container,
    Box,
    AppBar,
    Toolbar,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import emailjs from "emailjs-com";

interface Protestation {
    protestation: string;
}

const ProtestationForm: React.FC = () => {
    const [nom, setNom] = useState<string>("");
    const [prenom, setPrenom] = useState<string>("");
    const [protestation, setProtestation] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [formattedMessage, setFormattedMessage] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [protestations, setProtestations] = useState<Protestation[]>([]);
    const [emailSent, setEmailSent] = useState<boolean>(false);

    useEffect(() => {
        const storedNom = localStorage.getItem("nom");
        const storedPrenom = localStorage.getItem("prenom");

        if (storedNom && storedPrenom) {
            setNom(storedNom);
            setPrenom(storedPrenom);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!protestation) {
            setMessage("Veuillez entrer une protestation.");
            return;
        }

        const sender = `${nom} ${prenom}`;
        const data = { protestation, sender };

        try {
            const response = await fetch("http://localhost:5000/app/protest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Protestation envoyée avec succès !");
                setProtestation("");
            } else {
                setMessage(result.message || "Erreur lors de l'envoi.");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur.");
        }
    };

    const fetchUserProtestations = async () => {
        try {
            const sender = `${nom} ${prenom}`;
            const response = await fetch(`http://localhost:5000/app/protests/${sender}`);
            const data = await response.json();

            if (response.ok) {
                setProtestations(data);
            } else {
                setMessage(data.message || "Erreur lors de la récupération.");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur.");
        }
    };

    const handleSendEmail = () => {
        if (email && formattedMessage) {
            const templateParams = {
                to: email,
                message: formattedMessage,
            };

            const userId = "VTgiHANHc3BjDhH2O";

            emailjs
                .send("service_0zl6jng", "template_h654808", templateParams, userId)
                .then((response) => {
                    console.log("Email sent successfully:", response);
                    setEmailSent(true);
                })
                .catch((error) => {
                    console.error("Error sending email:", error);
                    setEmailSent(false);
                });
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: "#3f51b5" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Form protest</Typography>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/Chatbot"
                        sx={{ marginLeft: "auto" }}
                    >
                        Return
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Paper sx={{ p: 4, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                        Add your protest and send mail from your space
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Écrivez votre protestation ici..."
                            variant="outlined"
                            value={protestation}
                            onChange={(e) => setProtestation(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            label="Votre Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Message Formaté"
                            variant="outlined"
                            value={formattedMessage}
                            onChange={(e) => setFormattedMessage(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                borderRadius: "8px",
                                boxShadow: 2,
                                backgroundColor: "#3f51b5",
                                "&:hover": {
                                    backgroundColor: "#2c387e",
                                },
                            }}
                        >
                            Send Protest
                        </Button>
                    </form>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            onClick={fetchUserProtestations}
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{ borderRadius: "8px", boxShadow: 2 }}
                        >
                            Show my protest
                        </Button>
                    </Box>

                    {message && (
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 3,
                                color: message.includes("Erreur") ? "red" : "green",
                                textAlign: "center",
                            }}
                        >
                            {message}
                        </Typography>
                    )}

                    {protestations.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Your protest :</Typography>
                            <Box sx={{ mt: 2 }}>
                                {protestations.map((p, index) => (
                                    <Paper
                                        key={index}
                                        sx={{ p: 2, mb: 2, backgroundColor: "#e8eaf6" }}
                                    >
                                        <Typography variant="body1">{p.protestation}</Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ mt: 4 }}>
                        <Button
                            onClick={handleSendEmail}
                            variant="contained"
                            color="secondary"
                            fullWidth
                            sx={{ borderRadius: "8px", boxShadow: 2 }}
                        >
                            Send Mail
                        </Button>
                    </Box>

                    {emailSent && (
                        <Typography
                            variant="body2"
                            sx={{ mt: 3, color: "green", textAlign: "center" }}
                        >
                            Email sent successfully
                        </Typography>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default ProtestationForm;
