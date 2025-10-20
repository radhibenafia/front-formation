import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Link,
    Alert,
} from "@mui/material";
import axios from "axios";

const Login: React.FC = () => {
    const [nom, setNom] = useState<string>("");
    const [prenom, setPrenom] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/appi/login", { nom, prenom });

            if (response.status === 200) {
                localStorage.setItem("nom", nom);
                localStorage.setItem("prenom", prenom);
                navigate("/chatbot");
            }
        } catch (err) {
            setError("Erreur de connexion. Vérifiez vos informations.");
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#f8f9fc",
            }}
        >
            <Card sx={{ width: 400, boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
                        Connexion
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        fullWidth
                        label="Nom"
                        variant="outlined"
                        size="small"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Prénom"
                        variant="outlined"
                        size="small"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#3f51b5",
                            color: "white",
                            "&:hover": { backgroundColor: "#374151" },
                        }}
                        onClick={handleLogin}
                    >
                        Se connecter
                    </Button>

                    <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
                        <Link href="#">Mot de passe oublié ?</Link>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;
