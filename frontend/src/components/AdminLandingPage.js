import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    form: {
        maxWidth: '400px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        margin: '20px',
    },
    card: {
        marginBottom: '20px',
    },
}));

const AdminLandingPage = () => {
    const userId = 'user1';
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDomain, setProjectDomain] = useState('');
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, [userId]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5002/api/createProject', { name: projectName, domain: projectDomain });
            // Redirect to the admin dashboard for the new project
            console.log(response.data.projectId);
            navigate(`/admin/dashboard/${response.data.projectId}`);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <Container className={classes.root}>
            <Grid container justifyContent="center">
                <Grid item>
                    <Card className={classes.form}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Admin Dashboard
                            </Typography>
                            <form onSubmit={handleCreateProject}>
                                <TextField
                                    label="Project Name"
                                    fullWidth
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required
                                    className={classes.card}
                                />
                                <TextField
                                    label="Project Domain"
                                    fullWidth
                                    value={projectDomain}
                                    onChange={(e) => setProjectDomain(e.target.value)}
                                    required
                                    className={classes.card}
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Create Project
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography variant="h5" align="center" gutterBottom>
                Existing Projects
            </Typography>
            <Grid container justifyContent="center">
                {projects.map((project) => (
                    <Grid item key={project._id}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {project.project_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {project.project_type}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => navigate(`/admin/dashboard/${project._id}`)}
                                >
                                    Go to Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminLandingPage;
