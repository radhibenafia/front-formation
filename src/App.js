import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Grid, Card, CardContent, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Chatbot from './admin/Chatbot.tsx';
import Login from './admin/Login.tsx';
import Analyse from './admin/Analyse.tsx';
import Protestation from './admin/Protestation.tsx';
import Fileup from './admin/Fileadd.tsx';

import Game2 from "./admin/Game2.tsx"
import Game3 from "./admin/Game3.tsx"
import Info from "./admin/Info.tsx"
import Hugging from "./admin/Huggingface.tsx"

import Particp from './First/Particp.tsx';
import Acceuil from './First/Acceuil.tsx';

import Third from './First/Third.tsx';
import Second from './First/Second.tsx';
import Principaldoc from './First/Principaldoc.tsx';
import Test from './First/Test.tsx';
import Rapport from './First/Rapport.tsx';
import Posenetgame from './First/Posenetgame.tsx';
import Hello from './admin/Hello.tsx';
import Analytics from './admin/Analytics.tsx';
import Doctor from './doctor/Doctor.tsx';
import Progress from './doctor/Progress.tsx';
import Evaluation from './doctor/Evaluation.tsx';
import Facebook from './First/Facebook.tsx';



import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';



const drawerWidth = 240;
const data = [
  { name: 'Doctor', value: 20, color: 'red' },
  { name: 'Parent', value: 40, color: 'green' },
  { name: 'Admin', value: 5, color: 'orange' },
  { name: 'Other  ', value: 20, color: 'grey' },
];



function Home() {
  return (
    <div style={{ display: 'flex' }}>

      <div style={{ flexGrow: 1, padding: '20px' }}>
        <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>

            <Button variant="contained" color="secondary" component={Link} to="/Login">
              login Admin
            </Button>
            <Box sx={{ mx: 2 }} />
            <Button variant="contained" color="secondary" component={Link} to="/particp">
              login Parent
            </Button>
            <Box sx={{ mx: 2 }} />
            <Button variant="contained" color="secondary" component={Link} to="/Second">
              login Doctor
            </Button>
            <Box sx={{ mx: 2 }} />


          </Toolbar>
        </AppBar>

        <Container>
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Sales Value</Typography>
                  <Typography variant="h4" color="primary">$10,567</Typography>
                  <Typography color="success.main">Yesterday 10.57%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Customerslll</Typography>
                  <Typography variant="h4" color="primary">345k</Typography>
                  <Typography color="success.main">+22% </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Revenue</Typography>
                  <Typography variant="h4" color="primary">$43,594</Typography>
                  <Typography color="error">-2% Since last month</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mt: 5, color: "#3f51b5" }}>
            Understanding Autism
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", mt: 2 }}>
            Autism is a neurodevelopmental disorder that affects communication, social interactions, and behavior.
            It manifests differently in each person, with unique strengths and challenges. A better understanding
            of autism helps promote inclusion and supports autistic individuals in their daily lives.
          </Typography>





        </Container>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Analyse" element={<Analyse />} />
        <Route path="/Protestation" element={<Protestation />} />

        <Route path="/Fileup" element={<Fileup />} />

        <Route path="/Game2" element={<Game2 />} />
        <Route path="/Game3" element={<Game3 />} />

        <Route path="/Particp" element={<Particp />} />
        <Route path="/Acceuil" element={<Acceuil />} />
        <Route path="/Third" element={<Third />} />
        <Route path="/Hello" element={<Hello />} />
        <Route path="/Second" element={<Second />} />
        <Route path="/Principaldoc" element={<Principaldoc />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Posenetgame" element={<Posenetgame />} />
        <Route path="/Analytics" element={<Analytics />} />
        <Route path="/Progress" element={<Progress />} />
        <Route path="/Evaluation" element={<Evaluation />} />
        <Route path="/Rapport" element={<Rapport />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/Hugging" element={<Hugging />} />
        <Route path="/Facebook" element={<Facebook />} />






      </Routes>
    </Router>
  );
}

export default App;