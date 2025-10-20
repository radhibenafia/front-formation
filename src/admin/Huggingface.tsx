import React, { useState, useEffect } from 'react';
import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs';

const threshold = 0.85;
// Tu peux soit demander tous les labels par défaut en passant un tableau vide
const toxicityLabels: string[] = [];

// Type compatible avec les résultats du modèle
type ClassificationResult = {
    label: string;
    results: Array<{
        probabilities: Float32Array; // garder Float32Array, pas number[]
        match: boolean;
    }>;
};

const ToxicityChecker: React.FC = () => {
    const [model, setModel] = useState<toxicity.ToxicityClassifier | null>(null);
    const [inputText, setInputText] = useState('');
    const [predictions, setPredictions] = useState<ClassificationResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Passer un tableau vide au lieu de undefined
        toxicity.load(threshold, toxicityLabels).then((loadedModel) => {
            setModel(loadedModel);
            console.log('Modèle chargé');
        });
    }, []);

    const analyzeToxicity = async () => {
        if (!model) return;
        setLoading(true);
        const results = await model.classify([inputText]);
        // Cast en any puis en ClassificationResult pour bypasser l'erreur
        setPredictions(results as unknown as ClassificationResult[]);
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <h2>Détecteur de toxicité</h2>
            <textarea
                rows={5}
                placeholder="Tapez votre texte ici..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ width: '100%', padding: 10, fontSize: 16 }}
            />
            <button
                onClick={analyzeToxicity}
                disabled={!model || loading || inputText.trim() === ''}
                style={{ marginTop: 10, padding: '10px 20px', fontSize: 16 }}
            >
                {loading ? 'Analyse en cours...' : 'Analyser'}
            </button>

            {predictions.length > 0 && (
                <div style={{ marginTop: 20 }}>
                    <h3>Résultats :</h3>
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
                </div>
            )}
        </div>
    );
};

export default ToxicityChecker;
