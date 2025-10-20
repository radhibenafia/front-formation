import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Button,
    Toolbar,
    AppBar,
} from "@mui/material";

// Types TS pour SpeechRecognition
interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    start(): void;
    stop(): void;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

// Largeur sidebar
const drawerWidth = 240;

export default function SpeechRecognitionDemo() {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [lang, setLang] = useState<"ar-SA" | "en-US" | "fr-FR">("ar-SA");
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Web Speech API non supportée par ce navigateur.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setTranscript((prev) => prev + transcriptPart + " ");
                } else {
                    interimTranscript += transcriptPart;
                }
            }
        };


        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [lang]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            setTranscript("");
            recognitionRef.current.start();
            setListening(true);
        }
    };

    // Liste des langues pour la sidebar
    const languages = [
        { code: "ar-SA", label: "العربية (Arabe)" },
        { code: "en-US", label: "English (Anglais)" },
        { code: "fr-FR", label: "Français (French)" },
    ];

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <CssBaseline />

            {/* AppBar en haut */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Reconnaissance vocale pour enfants
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer / Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#e3f2fd",
                        paddingTop: 8,
                    },
                }}
            >
                <Toolbar />
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Choisir la langue
                </Typography>
                <List>
                    {languages.map(({ code, label }) => (
                        <ListItem key={code} disablePadding>
                            <ListItemButton
                                selected={lang === code}
                                onClick={() => !listening && setLang(code as any)}
                            >
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Contenu principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "#f0f8ff",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: lang === "ar-SA" ? "right" : "left",
                    direction: lang === "ar-SA" ? "rtl" : "ltr",
                }}
            >
                <Toolbar />

                <Button
                    variant="contained"
                    color={listening ? "error" : "success"}
                    onClick={toggleListening}
                    sx={{ fontSize: 22, borderRadius: 2, mb: 4, px: 5, py: 1.5 }}
                >
                    {listening ? "Arrêter" : "Démarrer"} la reconnaissance
                </Button>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 800,
                        minHeight: 200,
                        bgcolor: "#e6f0fa",
                        borderRadius: 3,
                        border: "3px solid #4a90e2",
                        padding: 3,
                        fontSize: 32,
                        fontFamily: "'Comic Sans MS', cursive, sans-serif",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        color: "#333",
                    }}
                >
                    {transcript || <i>Appuie sur démarrer et parle ici...</i>}
                </Box>
            </Box>
        </Box>
    );
}
