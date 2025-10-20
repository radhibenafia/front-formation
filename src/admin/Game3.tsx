import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    AppBar,
    Toolbar,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = "AIzaSyDy8E-74J317Q0cDcw_GbBi4sGa7iQvieQ";
const genAI = new GoogleGenerativeAI(apiKey);

const BehaviorAnalysis: React.FC = () => {
    const [description, setDescription] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [translated, setTranslated] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!description.trim()) return;
        setLoading(true);
        setAnalysis("");
        setTranslated("");

        try {
            // ✅ Utiliser le modèle stable actuel
            const model = genAI.getGenerativeModel({
                model: "models/gemini-2.5-flash",
            });

            const prompt = `

"${description}"


`;

            // ✅ Appel correct à la méthode generateContent
            const result = await model.generateContent([prompt]);
            const text = result.response.text();
            setAnalysis(text);
        } catch (error) {
            console.error("Erreur d’analyse avec Gemini :", error);
            setAnalysis("❌ Erreur lors de l’analyse. Vérifie la clé API ou le modèle.");
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = async () => {
        if (!analysis) return;

        try {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        q: analysis,
                        target: "fr",
                    }),
                }
            );
            const data = await response.json();
            const translatedText =
                data?.data?.translations?.[0]?.translatedText || "Erreur de traduction.";
            setTranslated(translatedText);
        } catch (error) {
            console.error("Erreur de traduction :", error);
            setTranslated("❌ Erreur lors de la traduction.");
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: "#3f51b5" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">ANALYTICS</Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Analyse comportementale TSA - Gemini 1.5 Flash
                    </Typography>

                    <TextField
                        label="Décrire le comportement de l'enfant"
                        multiline
                        fullWidth
                        minRows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAnalyze}
                        disabled={!description.trim() || loading}
                    >
                        {loading ? "Analyse en cours..." : "Analyser"}
                    </Button>

                    {analysis && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Analyse (en anglais) :</Typography>
                            <Typography sx={{ whiteSpace: "pre-line" }}>{analysis}</Typography>

                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleTranslate}
                                sx={{ mt: 2 }}
                            >
                                Traduire en français
                            </Button>
                        </Box>
                    )}

                    {translated && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Analyse (traduite) :</Typography>
                            <Typography sx={{ whiteSpace: "pre-line" }}>{translated}</Typography>
                        </Box>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default BehaviorAnalysis;
