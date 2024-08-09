// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Container, Typography, Box, Button } from '@mui/material';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         paddingTop: '40px', // Add padding to the top of the container
//     },
//     formContainer: {
//         width: '400px',
//         padding: '20px',
//         borderRadius: '8px',
//         boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//         backgroundColor: '#ffffff',
//     },
//     formTitle: {
//         marginBottom: '20px',
//         textAlign: 'center',
//     },
//     inputField: {
//         marginBottom: '20px',
//     },
// }));

// const UserLandingPage = () => {

//     const [tasks, setTasks] = useState([]);
//     const navigate = useNavigate();
//     const { userId } = useParams();
//     const classes = useStyles();

//     useEffect(() => {
//         const fetchAssignedTasks = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5002/api/sentences/${userId}`);
//                 setTasks(response.data);
//             } catch (error) {
//                 console.error('Error fetching sentences:', error);
//             }
//         };
//         fetchAssignedTasks();
//     }, [userId]);

//     return (
//         <Container className={classes.root}>
//             <Box className={classes.formContainer}>
//                 <Typography variant="h4" className={classes.formTitle}>
//                     User Dashboard
//                 </Typography>
//                 <Typography variant="h5">Assigned Tasks</Typography>
//                 <Box>
//                     {tasks.map((task) => (
//                         <Box key={task._id} mb={2}>
//                             <Typography variant="h6">{task.task_name}</Typography>
//                             <Button variant="contained" onClick={() => navigate(`/user/${userId}/task/${task._id}`)}>
//                                 Start Task
//                             </Button>
//                         </Box>
//                     ))}
//                 </Box>
//             </Box>
//         </Container>
//     );
// };

// export default UserLandingPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        paddingTop: '40px',
    },
    projectSection: {
        marginBottom: '30px',
    },
    projectTitle: {
        marginBottom: '10px',
    },
    task: {
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
}));

const UserLandingPage = () => {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading indicator
    const navigate = useNavigate();
    const { userId } = useParams();
    const classes = useStyles();
    console.log(userId);
    useEffect(() => {
        const fetchAssignedProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/projects/user/${userId}`);
                const fetchedProjects = response.data;
                setProjects(fetchedProjects);
                setLoading(false); // Set loading state to false once data is fetched
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchAssignedProjects();
    }, [userId]);

    const handleStartTask = (taskId) => {
        // console.log('printing projects');
        // projects.map((project) => console.log(project.tasks));
        // console.log(projects);
        navigate(`/user/${userId}/task/${taskId}`);
    };

    return (
        <Container className={classes.root}>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                projects.map((project) => (
                    <Box key={project.projectName} className={classes.projectSection}>
                        <Typography variant="h5" className={classes.projectTitle}>
                            Project Name: {project.projectName}
                        </Typography>
                        {project.tasks.length > 0 ? (
                            project.tasks.map((task) => (
                                <Box key={task.taskId} className={classes.task}>
                                    <Typography variant="h6">{task.taskName}</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleStartTask(task.taskId)}
                                        component={Link}
                                        to={`/user/${userId}/task/${task.taskId}`}
                                    >

                                        Start Task
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography>No tasks assigned to this project</Typography>
                        )}
                    </Box>
                ))
            )}
        </Container>
    );
};

export default UserLandingPage;
