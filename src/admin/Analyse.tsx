import React, { useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../config/Firebase.ts';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Paper,
    Box,
    Select,
    MenuItem,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    SelectChangeEvent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface FirestoreDocument {
    id: string;
    [key: string]: any;
}

const Analyse: React.FC = () => {
    const [documents, setDocuments] = useState<FirestoreDocument[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [documentCount, setDocumentCount] = useState<number>(0);
    const [selectedCollection, setSelectedCollection] = useState<string>('radhi');

    const collections: string[] = ['login', 'logind', 'Messenger'];

    const connectToFirestore = async () => {
        try {
            console.log(`Connecting to Firestore collection: ${selectedCollection}`);
            const querySnapshot = await getDocs(collection(firestore, selectedCollection));

            if (querySnapshot.empty) {
                console.log("No matching documents.");
                setIsConnected(true);
                setDocumentCount(0);
                setDocuments([]);
            } else {
                const docs: FirestoreDocument[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDocuments(docs);
                setDocumentCount(docs.length);
                setIsConnected(true);
            }
        } catch (error) {
            console.error('Error connecting to Firestore:', error);
            setIsConnected(false);
        }
    };

    const handleCollectionChange = (event: SelectChangeEvent) => {
        setSelectedCollection(event.target.value as string);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                key="analyse"
            >
                <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Analyse des Données
                        </Typography>
                        <Button color="inherit" component={Link} to="/Chatbot" sx={{ marginLeft: 'auto' }}>
                            Retour à l'Accueil
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container sx={{ mt: 4 }}>
                    <Paper sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Sélectionner une collection :
                            </Typography>
                            <Select
                                value={selectedCollection}
                                onChange={handleCollectionChange}
                                fullWidth
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff', boxShadow: 2 }}
                            >
                                {collections.map((col) => (
                                    <MenuItem key={col} value={col}>
                                        {col}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ backgroundColor: '#3f51b5', borderRadius: '8px', boxShadow: 2 }}
                                onClick={connectToFirestore}
                            >
                                Connecter à Firestore
                            </Button>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Connecté : {isConnected ? "Oui" : "Non"}</Typography>
                            <Typography variant="h6">Nombre de documents : {documentCount}</Typography>

                            {documents.length > 0 ? (
                                <TableContainer component={Paper} sx={{ mt: 3, borderRadius: '8px' }}>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead sx={{ backgroundColor: '#2775c2' }}>
                                            <TableRow>
                                                {Object.keys(documents[0]).map((key) => (
                                                    <TableCell
                                                        key={key}
                                                        sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}
                                                    >
                                                        {key}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {documents.map((doc) => (
                                                <TableRow key={doc.id}>
                                                    {Object.keys(documents[0]).map((key) => (
                                                        <TableCell key={key} sx={{ borderBottom: '1px solid #ccc' }}>
                                                            {JSON.stringify(doc[key])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography variant="body1" sx={{ mt: 3 }}>
                                    Aucun document trouvé.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </motion.div>
        </AnimatePresence>
    );
};

export default Analyse;