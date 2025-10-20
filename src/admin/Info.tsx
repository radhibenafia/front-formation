import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../config/Firebase.ts';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Container,
    Paper,
    TextField,
    Button,
    Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs';

const threshold = 0.85;
const toxicityLabels: string[] = [];

type ClassificationResult = {
    label: string;
    results: Array<{
        probabilities: Float32Array;
        match: boolean;
    }>;
};

const AddInfoForm: React.FC = () => {
    const [questions, setQuestions] = useState('');
    const [reponse, setReponse] = useState('');
    const [message, setMessage] = useState('');

    const [model, setModel] = useState<toxicity.ToxicityClassifier | null>(null);
    const [inputText, setInputText] = useState('');
    const [predictions, setPredictions] = useState<ClassificationResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        toxicity.load(threshold, toxicityLabels).then((loadedModel) => {
            setModel(loadedModel);
            console.log('Modèle de toxicité chargé');
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!questions || !reponse) {
            setMessage('Veuillez remplir tous les champs.');
            return;
        }

        try {
            await addDoc(collection(firestore, 'info'), {
                questions,
                reponse,
            });

            setMessage('✅ Données envoyées avec succès !');
            setQuestions('');
            setReponse('');
        } catch (error) {
            console.error('Erreur lors de l’ajout :', error);
            setMessage('❌ Erreur lors de l’envoi');
        }
    };

    const analyzeToxicity = async () => {
        if (!model) return;
        setLoading(true);
        const results = await model.classify([inputText]);
        setPredictions(results as unknown as ClassificationResult[]);
        setLoading(false);
    };

    return (
        <>
            {/* AppBar */}
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Ajouter une Information</Typography>
                    <Button color="inherit" component={Link} to="/Chatbot" sx={{ marginLeft: 'auto' }}>
                        Retour
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Formulaire Firebase */}
            <Container sx={{ mt: 4 }}>
                <Paper sx={{ p: 4, borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                        Formulaire d'ajout
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Question"
                            variant="outlined"
                            value={questions}
                            onChange={(e) => setQuestions(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Réponse"
                            variant="outlined"
                            value={reponse}
                            onChange={(e) => setReponse(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                backgroundColor: '#3f51b5',
                                '&:hover': { backgroundColor: '#303f9f' },
                            }}
                        >
                            Envoyer à Firebase
                        </Button>
                    </form>

                    {message && (
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 3,
                                color: message.includes('Erreur') || message.includes('❌') ? 'red' : 'green',
                                textAlign: 'center',
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </Paper>
            </Container>

            {/* Détecteur de toxicité */}
            <Container sx={{ mt: 6 }}>
                <Paper sx={{ p: 4, borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Détecteur de toxicité
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Tapez votre texte ici..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={analyzeToxicity}
                        disabled={!model || loading || inputText.trim() === ''}
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#b71c1c' },
                        }}
                    >
                        {loading ? 'Analyse en cours...' : 'Analyser'}
                    </Button>

                    {predictions.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Résultats :</Typography>
                            <ul>
                                {predictions.map(({ label, results }) => (
                                    <li key={label}>
                                        <strong>{label}</strong> :{' '}
                                        {results[0].match ? (
                                            <span style={{ color: 'red' }}>Toxique</span>
                                        ) : (
                                            <span style={{ color: 'green' }}>Non toxique</span>
                                        )}{' '}
                                        (score : {results[0].probabilities[1].toFixed(2)})
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default AddInfoForm;
