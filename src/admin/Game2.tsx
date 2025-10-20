import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

interface Question {
  question: string;
  correct_answer: string;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  const fetchQuestions = () => {
    setLoading(true);
    fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=boolean")
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setQuestions(data.results);
        } else {
          setQuestions([]);
        }
        setQuizStarted(true);
      })
      .catch((error) => console.error("Erreur API :", error))
      .finally(() => setLoading(false));
  };

  const handleAnswer = (index: number, answer: string) => {
    if (answers[index] !== undefined || !questions) return;

    const isCorrect = answer === questions[index].correct_answer;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [index]: answer }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Form protest & Quiz game</Typography>
          <Button color="inherit" component={Link} to="/Chatbot" sx={{ marginLeft: 'auto' }}>
            Return
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" gutterBottom>Quiz True/False</Typography>

        {!quizStarted && (
          <Button variant="contained" color="primary" onClick={fetchQuestions} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Commencer le quiz"}
          </Button>
        )}

        {questions === null ? (
          <Typography variant="body1" sx={{ mt: 3 }}>
            Veuillez cliquer sur "Commencer le quiz"
          </Typography>
        ) : !showResult ? (
          <>
            {questions.map((q, index) => (
              <Card key={index} sx={{ mt: 3, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" dangerouslySetInnerHTML={{ __html: q.question }} />
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAnswer(index, "True")}
                      disabled={answers[index] !== undefined}
                    >
                      True
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleAnswer(index, "False")}
                      disabled={answers[index] !== undefined}
                    >
                      False
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 4 }}
              onClick={() => setShowResult(true)}
            >
              Voir les résultats
            </Button>
          </>
        ) : (
          <Card sx={{ mt: 4, p: 3 }}>
            <CardContent>
              <Typography variant="h5">Résultat</Typography>
              <Typography variant="h6">Score : {score} / {questions.length}</Typography>
              <Typography variant="h6">
                Moyenne : {(score / questions.length * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Quiz;
