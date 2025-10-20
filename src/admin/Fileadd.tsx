import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

// Définir le type pour les fichiers récupérés
interface UploadedFile {
  _id: string;
  title: string;
  creator: string;
  image?: string;
  content?: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const storedNom = localStorage.getItem("nom") || "";
  const storedPrenom = localStorage.getItem("prenom") || "";

  const [nom, setNom] = useState<string>(storedNom);
  const [prenom, setPrenom] = useState<string>(storedPrenom);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file || !title || !nom || !prenom) {
      setMessage("Tous les champs sont obligatoires !");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("nom", nom);
    formData.append("prenom", prenom);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/ati/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      fetchFiles();
    } catch (error) {
      setMessage("Erreur lors de l'upload !");
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get<{ files: UploadedFile[] }>("http://localhost:5000/ati/files/files");
      setFiles(response.data.files);
    } catch (error) {
      setMessage("Erreur lors de la récupération des fichiers !");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <AppBar position="sticky" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Gestion des Fichiers</Typography>
          <Button color="inherit" component={Link} to="/Chatbot" sx={{ marginLeft: "auto" }}>
            Return
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Upload de fichier
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Titre"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nom"
              variant="outlined"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              sx={{ mb: 2 }}
              disabled
            />
            <TextField
              fullWidth
              label="Prénom"
              variant="outlined"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              sx={{ mb: 2 }}
              disabled
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                mb: 3,
                backgroundColor: "#3f51b5",
                "&:hover": { backgroundColor: "#303f9f" },
              }}
            >
              Choisir un fichier
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#3f51b5",
                "&:hover": { backgroundColor: "#303f9f" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Envoyer"}
            </Button>
          </form>

          {message && (
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: message.includes("Erreur") ? "red" : "green",
                textAlign: "center",
              }}
            >
              {message}
            </Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Fichiers Uploadés :</Typography>
            <Button
              onClick={fetchFiles}
              variant="outlined"
              color="secondary"
              sx={{
                borderRadius: "8px",
                boxShadow: 2,
                mt: 2,
              }}
            >
              Rafraîchir la Liste des Fichiers
            </Button>
            <Box sx={{ mt: 3 }}>
              {files.length > 0 ? (
                <Grid container spacing={2}>
                  {files.map((file) => (
                    <Grid item xs={12} sm={6} md={4} key={file._id}>
                      <Paper sx={{ p: 2, backgroundColor: "#e8eaf6", borderRadius: "8px" }}>
                        <Typography variant="h6">{file.title}</Typography>
                        <Typography variant="body2">
                          <strong>Créé par :</strong> {file.creator}
                        </Typography>
                        {file.image && (
                          <img
                            src={`http://localhost:5000/images/${file.image}`}
                            alt={file.title}
                            width="100"
                            height="100"
                            style={{ marginTop: "10px", borderRadius: "4px" }}
                          />
                        )}
                        {file.content && (
                          <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                            {file.content}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2">Aucun fichier trouvé.</Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default FileUpload;
