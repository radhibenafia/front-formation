import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#212529',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <List>

        <ListItemButton component={Link} to="/Analytics">
          <ListItemIcon><BarChartIcon style={{ color: '#fff' }} /></ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItemButton>
        <ListItemButton component={Link} to="/settings">
          <ListItemIcon><SettingsIcon style={{ color: '#fff' }} /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

const Chatbot: React.FC = () => {
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");

  useEffect(() => {
    const storedNom = localStorage.getItem("nom");
    const storedPrenom = localStorage.getItem("prenom");

    if (storedNom) setNom(storedNom);
    if (storedPrenom) setPrenom(storedPrenom);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>

            <Button variant="contained" color="secondary" component={Link} to="/Analyse">
              Analysis
            </Button>
            <Box sx={{ mx: 2 }} />
            <Button variant="contained" color="secondary" component={Link} to="/Protestation">
              Add Protest
            </Button>
            <Box sx={{ mx: 2 }} />
            <Button variant="contained" color="secondary" component={Link} to="/Fileup">
              File analysis
            </Button>
            <Box sx={{ mx: 2 }} />
            <Button variant="contained" color="secondary" component={Link} to="/Info">
              Add Document
            </Button>
            <Box sx={{ mx: 2 }} />

            <Button variant="contained" color="secondary" component={Link} to="/Login">
              Return
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
                  <Typography variant="h5">Customers</Typography>
                  <Typography variant="h4" color="primary">345k</Typography>
                  <Typography color="success.main">+22% Since last month</Typography>
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
            <Grid item xs={12}>
              <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
                    Hello {nom} {prenom} 👋
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Hello admin there is a workll
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Chatbot;
