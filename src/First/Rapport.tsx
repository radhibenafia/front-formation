import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../config/Firebase.ts";

import {
    Container,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Box,
    IconButton,
    AppBar,
    Toolbar,
    Button,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import html2pdf from 'html2pdf.js';

interface Evaluation {
    doctor: string;
    parent: string;
    rapport: string;
    commentaire?: string;
    symptomes?: string;
    comportement?: string;
    communication?: string;
    interactions?: string;
    recommandations?: string;
    date?: any;
}

const EvaluationsParent: React.FC = () => {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const emailParent = localStorage.getItem("emailparent");

    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        if (!emailParent) {
            console.warn("No parent email found in localStorage.");
            setLoading(false);
            return;
        }

        const fetchEvaluations = async () => {
            try {
                const q = query(
                    collection(firestore, "evaluation"),
                    where("parent", "==", emailParent)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => doc.data() as Evaluation);
                setEvaluations(data);
            } catch (error) {
                console.error("Error fetching evaluations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluations();
    }, [emailParent]);

    const downloadPdf = (index: number) => {
        const element = cardRefs.current[index];
        if (element) {
            html2pdf()
                .from(element)
                .set({
                    margin: 10,
                    filename: `evaluation-${index + 1}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                })
                .save();
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Evaluations</Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    📋 Your Medical Evaluations
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : evaluations.length === 0 ? (
                    <Typography align="center">No evaluations found.</Typography>
                ) : (
                    evaluations.map((evalData, index) => (
                        <Card
                            key={index}
                            sx={{ mb: 3, borderRadius: 3, boxShadow: 2, position: "relative" }}
                        >
                            <CardContent id={`card-${index}`}>
                                <div ref={(el) => { cardRefs.current[index] = el; }}>
                                    <Typography variant="h6" gutterBottom>
                                        👨‍⚕️ Doctor: {evalData.doctor}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        📝 Report: {evalData.rapport}
                                    </Typography>
                                    {evalData.commentaire && (
                                        <Typography variant="body2" gutterBottom>
                                            💬 Comment: {evalData.commentaire}
                                        </Typography>
                                    )}
                                    {evalData.symptomes && (
                                        <Typography variant="body2">
                                            ⚠️ Symptoms: {evalData.symptomes}
                                        </Typography>
                                    )}
                                    {evalData.comportement && (
                                        <Typography variant="body2">
                                            🧠 Behavior: {evalData.comportement}
                                        </Typography>
                                    )}
                                    {evalData.communication && (
                                        <Typography variant="body2">
                                            🗣️ Communication: {evalData.communication}
                                        </Typography>
                                    )}
                                    {evalData.interactions && (
                                        <Typography variant="body2">
                                            🤝 Social Interactions: {evalData.interactions}
                                        </Typography>
                                    )}
                                    {evalData.recommandations && (
                                        <Typography variant="body2">
                                            ✅ Recommendations: {evalData.recommandations}
                                        </Typography>
                                    )}
                                    {evalData.date?.toDate && (
                                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                            🕒 Date: {evalData.date.toDate().toLocaleString()}
                                        </Typography>
                                    )}
                                </div>
                            </CardContent>
                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => downloadPdf(index)}
                                >
                                    Download
                                </Button>
                            </Box>
                        </Card>
                    ))
                )}
            </Container>
        </>
    );
};

export default EvaluationsParent;
