import React, { useState } from "react";
import {
    Box, Button, TextField, Typography, Grid, IconButton, AppBar, Toolbar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import axios from "axios";

const AutismInsightForm: React.FC = () => {
    const [formData, setFormData] = useState({
        doctorName: "",
        experienceYears: "",
        specialty: "",
        commonSymptoms: [""],
        ageOfDiagnosis: "",
        effectiveTherapies: "",
        communicationChallenges: "",
        socialBehavior: "",
        familySupportTips: "",
        frequentComorbidities: [""],
        personalObservations: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (
        field: "commonSymptoms" | "frequentComorbidities",
        index: number,
        value: string
    ) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData(prev => ({ ...prev, [field]: updated }));
    };

    const addArrayField = (field: "commonSymptoms" | "frequentComorbidities") => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/insights/doctoradd", {
                ...formData,
                experienceYears: Number(formData.experienceYears),
            });
            alert("Formulaire soumis !");
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
            alert("Erreur lors de la soumission");
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Formulaire Autisme - Médecin</Typography>

                </Toolbar>
            </AppBar>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
                <Typography variant="h4" gutterBottom>Formulaire Autisme - Médecin</Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Nom du médecin" name="doctorName" onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Années d'expérience" name="experienceYears" type="number" onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Spécialité" name="specialty" onChange={handleChange} required />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Symptômes fréquents</Typography>
                        {formData.commonSymptoms.map((symptom, i) => (
                            <TextField
                                key={i}
                                fullWidth
                                margin="dense"
                                value={symptom}
                                onChange={(e) => handleArrayChange("commonSymptoms", i, e.target.value)}
                            />
                        ))}
                        <IconButton onClick={() => addArrayField("commonSymptoms")}><AddIcon /></IconButton>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Âge moyen du diagnostic" name="ageOfDiagnosis" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Thérapies efficaces" name="effectiveTherapies" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Défis de communication" name="communicationChallenges" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Comportement social" name="socialBehavior" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Conseils aux familles" name="familySupportTips" onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Comorbidités fréquentes</Typography>
                        {formData.frequentComorbidities.map((item, i) => (
                            <TextField
                                key={i}
                                fullWidth
                                margin="dense"
                                value={item}
                                onChange={(e) => handleArrayChange("frequentComorbidities", i, e.target.value)}
                            />
                        ))}
                        <IconButton onClick={() => addArrayField("frequentComorbidities")}><AddIcon /></IconButton>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Observations personnelles" name="personalObservations" onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">Soumettre</Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default AutismInsightForm;
