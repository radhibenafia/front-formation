import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    Timestamp,
} from "firebase/firestore";
import { firestore } from "../config/Firebase.ts";

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

interface User {
    nom: string;
    email: string;
    adresse: string;
    ageEnfant: string;
    nombreFils: string;
    numeroTelephone: string;
    pays: string;
}

const Evaluation: React.FC = () => {
    const [patient, setPatient] = useState<User | null>(null);
    const [emailProgress, setEmailProgress] = useState<string | null>(null);
    const [emailDoc, setEmailDoc] = useState<string | null>(null);

    // Champs du rapport
    const [rapport, setRapport] = useState<string>("");
    const [commentaire, setCommentaire] = useState<string>("");

    // Champs supplémentaires
    const [symptomes, setSymptomes] = useState("");
    const [comportement, setComportement] = useState("");
    const [communication, setCommunication] = useState("");
    const [interactions, setInteractions] = useState("");
    const [recommandations, setRecommandations] = useState("");

    useEffect(() => {
        const progressEmail = localStorage.getItem("emailprogress");
        const docEmail = localStorage.getItem("emaildoc");

        setEmailProgress(progressEmail);
        setEmailDoc(docEmail);

        if (!progressEmail) return;

        const fetchPatient = async () => {
            const querySnapshot = await getDocs(collection(firestore, "login"));
            const data = querySnapshot.docs
                .map((doc) => doc.data() as User)
                .find((u) => u.email === progressEmail);

            if (data) setPatient(data);
        };

        fetchPatient();
    }, []);

    const handleSubmit = async () => {
        if (!emailDoc || !emailProgress || rapport.trim() === "") {
            alert("Veuillez remplir tous les champs requis.");
            return;
        }

        try {
            await addDoc(collection(firestore, "evaluation"), {
                doctor: emailDoc,
                parent: emailProgress,
                rapport,
                commentaire,
                symptomes,
                comportement,
                communication,
                interactions,
                recommandations,
                date: Timestamp.now(),
            });

            alert("Rapport soumis avec succès !");
            setRapport("");
            setCommentaire("");
            setSymptomes("");
            setComportement("");
            setCommunication("");
            setInteractions("");
            setRecommandations("");
        } catch (error) {
            console.error("Erreur lors de l'envoi du rapport :", error);
            alert("Une erreur est survenue.");
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Doctor Evaluation</Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom align="center">
                    📝 Évaluation du patient
                </Typography>

                <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                    <Typography variant="subtitle1">
                        <LocalHospitalIcon sx={{ mr: 1 }} />
                        <strong>Email du médecin :</strong> {emailDoc ?? "Non trouvé"}
                    </Typography>
                    <Typography variant="subtitle1">
                        <AssignmentIndIcon sx={{ mr: 1 }} />
                        <strong>Email du patient :</strong> {emailProgress ?? "Non trouvé"}
                    </Typography>
                </Box>

                {patient ? (
                    <Card sx={{ borderRadius: 4, boxShadow: 4, padding: 2, mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <PersonIcon sx={{ mr: 1 }} />
                                {patient.nom}
                            </Typography>
                            <Typography color="textSecondary">
                                <EmailIcon sx={{ mr: 1 }} />
                                {patient.email}
                            </Typography>
                            <Typography color="textSecondary">
                                <LocationOnIcon sx={{ mr: 1 }} />
                                {patient.adresse}
                            </Typography>
                            <Typography color="textSecondary">
                                <ChildCareIcon sx={{ mr: 1 }} />
                                Âge de l’enfant : {patient.ageEnfant}
                            </Typography>
                            <Typography color="textSecondary">
                                <PeopleIcon sx={{ mr: 1 }} />
                                Nombre d’enfants : {patient.nombreFils}
                            </Typography>
                            <Typography color="textSecondary">
                                <PhoneIcon sx={{ mr: 1 }} />
                                Téléphone : {patient.numeroTelephone}
                            </Typography>
                            <Typography color="textSecondary">
                                <PublicIcon sx={{ mr: 1 }} />
                                Pays : {patient.pays}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="body1" sx={{ mt: 4 }}>
                        Chargement ou patient non trouvé...
                    </Typography>
                )}

                {/* 🧠 Formulaire d'évaluation */}
                <Card sx={{ borderRadius: 4, boxShadow: 2, p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Rédiger le rapport médical
                    </Typography>
                    <TextField
                        label="Doctor (automatique)"
                        value={emailDoc ?? ""}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Parent (automatique)"
                        value={emailProgress ?? ""}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Rapport sur l'enfant"
                        multiline
                        minRows={4}
                        value={rapport}
                        onChange={(e) => setRapport(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Commentaires complémentaires (facultatif)"
                        multiline
                        minRows={2}
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Champs supplémentaires */}
                    <TextField
                        label="Symptômes observés"
                        multiline
                        minRows={2}
                        value={symptomes}
                        onChange={(e) => setSymptomes(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Comportement de l'enfant"
                        multiline
                        minRows={2}
                        value={comportement}
                        onChange={(e) => setComportement(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Communication (verbal/non-verbal)"
                        multiline
                        minRows={2}
                        value={communication}
                        onChange={(e) => setCommunication(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Interactions sociales"
                        multiline
                        minRows={2}
                        value={interactions}
                        onChange={(e) => setInteractions(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Recommandations"
                        multiline
                        minRows={2}
                        value={recommandations}
                        onChange={(e) => setRecommandations(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        Soumettre le rapport
                    </Button>
                </Card>
            </Container>
        </>
    );
};

export default Evaluation;
