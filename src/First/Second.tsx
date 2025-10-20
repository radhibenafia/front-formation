import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Alert,
} from "@mui/material";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore } from "../config/Firebase.ts"; // Assurez-vous du bon chemin vers Firebase.js

// Déclaration de type pour le composant fonctionnel
const Second: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");  // Spécification du type pour l'email
    const [nom, setNom] = useState<string>("");  // Spécification du type pour le nom
    const [error, setError] = useState<string>("");  // Spécification du type pour l'erreur

    // Fonction de connexion avec gestion des erreurs
    const handleLogin = async (): Promise<void> => {
        try {
            const q = query(
                collection(firestore, "logind"),
                where("email", "==", email),
                where("nom", "==", nom)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Stocker les données en localStorage (optionnel)
                localStorage.setItem("emaildoc", email);
                localStorage.setItem("nomdoc", nom);

                // Rediriger vers la page "Acceuil"
                navigate("/Principaldoc");
            } else {
                setError("Email ou nom incorrect.");
            }
        } catch (e) {
            console.error("Erreur lors de la recherche : ", e);
            setError("Une erreur est survenue lors de la connexion.");
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#f7f7f7",
            }}
        >
            <Card sx={{ width: 400, padding: 3, boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
                        Connexion
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Nom"
                        variant="outlined"
                        size="small"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#6200ea",
                            color: "white",
                            "&:hover": { backgroundColor: "#5a00d2" },
                        }}
                        onClick={handleLogin}
                    >
                        Se connecter
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Second;
