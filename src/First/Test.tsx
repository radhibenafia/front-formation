import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, AppBar, Toolbar, IconButton, } from "@mui/material";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const GameForChildren: React.FC = () => {
    const [model, setModel] = useState<any>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [image, setImage] = useState<string>("");
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [player1Guess, setPlayer1Guess] = useState("");
    const [player2Guess, setPlayer2Guess] = useState("");
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            const loadedModel = await mobilenet.load();
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setImage(imageData);
                setPrediction(null);
                setWinner(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateGuesses = async () => {
        if (!model || !image) return;

        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.onload = async () => {
            const predictions = await model.classify(imgElement);
            const modelPrediction = predictions[0]?.className.toLowerCase();
            setPrediction(modelPrediction);

            const p1 = player1Guess.trim().toLowerCase();
            const p2 = player2Guess.trim().toLowerCase();

            const p1Match = modelPrediction?.includes(p1);
            const p2Match = modelPrediction?.includes(p2);

            if (p1Match && p2Match) {
                setWinner("Égalité !");
            } else if (p1Match) {
                setWinner("Joueur 1 gagne 🎉");
            } else if (p2Match) {
                setWinner("Joueur 2 gagne 🎉");
            } else {
                setWinner("Aucun joueur n'a trouvé 😅");
            }
        };
    };

    const startGame = () => {
        setIsGameStarted(true);
        setImage("");
        setPrediction(null);
        setPlayer1Guess("");
        setPlayer2Guess("");
        setWinner(null);
    };

    const stopGame = () => {
        setIsGameStarted(false);
    };

    const canValidate = player1Guess.trim() !== "" && player2Guess.trim() !== "" && image;

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">AI game</Typography>
                    <Button color="inherit" component={Link} to="/Chatbot" sx={{ marginLeft: 'auto' }}>
                        Return
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h4">Jeu de Reconnaissance à Deux Joueurs</Typography>

                {!isGameStarted ? (
                    <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={startGame}>
                        Commencer le jeu
                    </Button>
                ) : (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Étape 1 : Télécharger une image</Typography>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: "20px 0" }} />

                        {image && <img src={image} alt="uploadée" width="200" style={{ borderRadius: 8 }} />}

                        <Typography variant="h6" sx={{ mt: 4 }}>Étape 2 : Les joueurs font leur proposition</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300, margin: "0 auto", mt: 2 }}>
                            <TextField
                                label="Joueur 1"
                                value={player1Guess}
                                onChange={(e) => setPlayer1Guess(e.target.value)}
                                disabled={!!prediction}
                            />
                            <TextField
                                label="Joueur 2"
                                value={player2Guess}
                                onChange={(e) => setPlayer2Guess(e.target.value)}
                                disabled={!!prediction}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            color="success"
                            sx={{ mt: 3 }}
                            onClick={validateGuesses}
                            disabled={!canValidate || !!prediction}
                        >
                            Valider les réponses
                        </Button>

                        {prediction && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6">🧠 Prédiction du modèle : <strong>{prediction}</strong></Typography>
                                <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>{winner}</Typography>
                            </Box>
                        )}

                        <Button variant="contained" color="secondary" sx={{ mt: 4 }} onClick={stopGame}>
                            Terminer le jeu
                        </Button>
                    </Box>
                )}
            </Box>
            /</>);
};

export default GameForChildren;
