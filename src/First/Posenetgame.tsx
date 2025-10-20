import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

const PoseDetectionGame: React.FC = () => {
    const [model, setModel] = useState<any>(null);
    const [imagePoseData, setImagePoseData] = useState<any>(null);
    const [result, setResult] = useState<string>("");
    const [randomPose, setRandomPose] = useState<string>(""); // Pose demandée (main droite ou gauche levée)

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready(); // S'assurer que TensorFlow.js est prêt
            const loadedModel = await posenet.load(); // Charger le modèle PoseNet
            setModel(loadedModel); // Sauvegarder le modèle
        };

        loadModel();
        chooseRandomPose(); // Choisir une pose aléatoire au démarrage
    }, []);

    // Fonction pour choisir une pose aléatoire (main droite ou gauche levée)
    const chooseRandomPose = () => {
        const poses = ["left", "right"];
        const randomPose = poses[Math.floor(Math.random() * poses.length)];
        setRandomPose(randomPose);
    };

    // Fonction pour analyser la pose à partir des données
    const analyzePose = (poseData: any) => {
        const keypoints = poseData.keypoints;
        let resultText = "";

        // Vérification de la position des mains (main gauche et main droite)
        const leftWrist = keypoints.find((point: any) => point.part === "leftWrist");
        const rightWrist = keypoints.find((point: any) => point.part === "rightWrist");

        let handDetected = false;

        if (leftWrist && leftWrist.score > 0.5) {
            if (leftWrist.position.y < 150) {
                if (randomPose === "left") {
                    handDetected = true;
                    resultText += "Main gauche levée, bravo !\n";
                } else {
                    resultText += "Main gauche levée, mais ce n'était pas la consigne.\n";
                }
            } else {
                resultText += "Main gauche non levée.\n";
            }
        }

        if (rightWrist && rightWrist.score > 0.5) {
            if (rightWrist.position.y < 150) {
                if (randomPose === "right") {
                    handDetected = true;
                    resultText += "Main droite levée, bravo !\n";
                } else {
                    resultText += "Main droite levée, mais ce n'était pas la consigne.\n";
                }
            } else {
                resultText += "Main droite non levée.\n";
            }
        }

        if (handDetected) {
            setResult("Gagné ! Vous avez levé la main correctement.");
        } else {
            setResult(resultText + " Essayez encore !");
            chooseRandomPose(); // Redemander une nouvelle pose
        }
    };

    // Fonction pour charger l'image et analyser la pose
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageURL = URL.createObjectURL(file);
            const img = new Image();
            img.src = imageURL;

            img.onload = async () => {
                const pose = await model.estimateSinglePose(img, {
                    flipHorizontal: false,
                });
                setImagePoseData(pose);
                analyzePose(pose); // Analyser la pose une fois l'image chargée
            };
        }
    };

    return (
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
            <Typography variant="h4">Détection de Pose à partir d'une Image</Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Pose demandée: {randomPose === "left" ? "Main gauche levée" : "Main droite levée"}
            </Typography>
            <Box sx={{ marginTop: 3 }}>
                <Button variant="contained" component="label">
                    Télécharger une image
                    <input
                        type="file"
                        hidden
                        onChange={handleImageUpload}
                    />
                </Button>
            </Box>

            {imagePoseData && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">Résultat de la détection :</Typography>
                    <Typography>{result}</Typography>

                    {/* Affichage du JSON des scores de pose */}
                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h6">Données JSON de la pose :</Typography>
                        <pre>{JSON.stringify(imagePoseData, null, 2)}</pre>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default PoseDetectionGame;
