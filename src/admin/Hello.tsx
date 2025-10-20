import React, { useRef, useState } from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';

const ColoringGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [color, setColor] = useState<string>('red'); // Couleur par défaut

    // Fonction pour changer la couleur sélectionnée
    const changeColor = (newColor: string) => {
        setColor(newColor);
    };

    // Fonction pour dessiner un carré et un cercle sur le canvas
    const drawShapes = (ctx: CanvasRenderingContext2D) => {
        // Dessiner un carré
        ctx.fillStyle = 'gray'; // Couleur de fond par défaut
        ctx.fillRect(50, 50, 100, 100); // Position (50, 50) et taille (100x100)

        // Dessiner un cercle
        ctx.beginPath();
        ctx.arc(300, 100, 50, 0, 2 * Math.PI); // Position (300, 100) et rayon 50
        ctx.fillStyle = 'gray'; // Couleur de fond par défaut
        ctx.fill();
    };

    // Gérer le clic sur les formes
    const handleCanvasClick = (event: React.MouseEvent) => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const canvas = canvasRef.current;
                const mouseX = event.clientX - canvas.offsetLeft;
                const mouseY = event.clientY - canvas.offsetTop;

                // Si l'utilisateur clique dans le carré
                if (mouseX >= 50 && mouseX <= 150 && mouseY >= 50 && mouseY <= 150) {
                    ctx.fillStyle = color; // Appliquer la couleur sélectionnée
                    ctx.fillRect(50, 50, 100, 100);
                }

                // Si l'utilisateur clique dans le cercle
                const distance = Math.sqrt(Math.pow(mouseX - 300, 2) + Math.pow(mouseY - 100, 2));
                if (distance <= 50) {
                    ctx.beginPath();
                    ctx.arc(300, 100, 50, 0, 2 * Math.PI);
                    ctx.fillStyle = color; // Appliquer la couleur sélectionnée
                    ctx.fill();
                }
            }
        }
    };

    // Dessiner les formes initiales sur le canvas
    const drawInitialShapes = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                drawShapes(ctx);
            }
        }
    };

    // Re-dessiner les formes quand la page est chargée
    React.useEffect(() => {
        drawInitialShapes();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Jeu de coloriage
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="contained" sx={{ backgroundColor: 'red' }} onClick={() => changeColor('red')}>Rouge</Button>
                <Button variant="contained" sx={{ backgroundColor: 'blue' }} onClick={() => changeColor('blue')}>Bleu</Button>
                <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={() => changeColor('green')}>Vert</Button>
                <Button variant="contained" sx={{ backgroundColor: 'yellow' }} onClick={() => changeColor('yellow')}>Jaune</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={400}
                    onClick={handleCanvasClick}
                    style={{ border: '1px solid black', borderRadius: '8px' }}
                />
            </Box>
        </Box>
    );
};

export default ColoringGame;
