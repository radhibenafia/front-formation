// src/First/PatientsList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../config/Firebase.ts";
import {
    Card,
    CardContent,
    Typography,
    Container,
    Grid,
    Box, AppBar, Toolbar, IconButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';

interface User {
    nom: string;
    email: string;
    adresse: string;
    ageEnfant: string;
    nombreFils: string;
    numeroTelephone: string;
    pays: string;
}

const PatientsList: React.FC = () => {
    const navigate = useNavigate();
    const [nomdoc, setNomdoc] = useState<string>("");
    const [emaildoc, setEmaildoc] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const storedNom = localStorage.getItem("nomdoc");
        const storedEmail = localStorage.getItem("emaildoc");

        if (storedNom) setNomdoc(storedNom);
        else navigate("/");

        if (storedEmail) setEmaildoc(storedEmail);

        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(firestore, "login"));
            const data = querySnapshot.docs.map((doc) => doc.data() as User);
            setUsers(data);
        };

        fetchUsers();
    }, [navigate]);

    const handleOpenDialog = (email: string) => {
        localStorage.setItem("emailprogress", email);
        navigate("/Evaluation");
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Doctor evalaution</Typography>

                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    👨‍⚕️
                    Patient List
                </Typography>

                <Grid container spacing={3}>
                    {users.map((user, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                onClick={() => handleOpenDialog(user.email)}
                                sx={{
                                    cursor: "pointer",
                                    boxShadow: 3,
                                    borderRadius: 3,
                                    transition: "transform 0.2s",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        {user.nom}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        {user.email}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        {user.adresse}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <ChildCareIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        Âge enfant: {user.ageEnfant}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <PeopleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        Enfants: {user.nombreFils}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        {user.numeroTelephone}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <PublicIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                        {user.pays}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            /</>);
};

export default PatientsList;
