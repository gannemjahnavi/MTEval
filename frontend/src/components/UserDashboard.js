

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    FormLabel,
    Button,
    TextField,
    LinearProgress,
    Divider,
    Grid,
    Tooltip,
    ArrowUpward, ArrowDownward
} from '@mui/material';
import Logo from './imgg.png'; // Adjust path to your logo image

const UserPage = () => {

    const { taskId, userId } = useParams();
    const [taskName, setTaskName] = useState("");
    const [projectName, setProjectName] = useState("");
    // const [userRole, setUserRole] = useState("user");
    const [projectId, setProjectId] = useState("");
    const [sentences, setSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [sentenceIndexInput, setSentenceIndexInput] = useState('');
    const [progress, setProgress] = useState(0);
    const [questionStatus, setQuestionStatus] = useState([]);

    const completedSentences = sentences.filter((sentence) => sentence.done);

    const resetBackendAndProgress = async () => {
        try {
            // Send request to backend to reset updatedSentences
            // console.log('hello');
            await axios.post('http://localhost:5002/api/resetSentences');

            // Reset local state in frontend
            setSentences([]);
            setProgress((prevProgress) => prevProgress + 1); // Increment progress by 1

            alert('Backend and progress reset successfully');
        } catch (error) {
            console.error('Error resetting backend and progress:', error);
            alert('Failed to reset backend and progress');
        }
    };

    const [answers, setAnswers] = useState({
        /* Mistranslation: null,*/
        incorrect_word_choice: null,
        tense_error: null,
        gnp_error: null,
        contextual_error: null,
        tone: null,
        voice_error: null,
        punctuation: null,
        addition: null,
        omission: null,
        rentention: null,
        unnatural: null,
        spelling_typological: null,
        ne: null,
        mistranslation: null,
        part_of_speech: null,
        function_words: null,
        fluency: null,
        coherence: null,
        connectives: null,
        terminology: null,
        status: null
    });


    const translationPaperRef = useRef(null);
    const sourcePaperRef = useRef(null);

    useEffect(() => {
        if (sentences.length > 0) {
            updateProgress(sentences);
        }
    }, [sentences]);
    const fetchTaskName = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/tasks/${taskId}/name`);
            const taskName = response.data.task_name;
            setTaskName(taskName);
            console.log('Task name:', taskName);
        } catch (error) {
            console.error("Error fetching task name:", error);
        }
    };
    useEffect(() => {
        fetchTaskName();
    }, [taskId]);

    // const fetchUserRole = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:5002/api/users/${userId}/name`);
    //         const userRole = response.data.user_role;
    //         setUserRole(userRole);
    //         console.log('User Role:', userRole);
    //     } catch (error) {
    //         console.error("Error fetching user role:", error);
    //     }
    // };
    // useEffect(() => {
    //     fetchUserRole();
    // }, [userId]);


    const fetchProjectName = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/tasks/${taskId}/projectname`);
            const projectName = response.data.project_name;
            const projectId = response.data.proj_id;
            setProjectName(projectName);
            setProjectId(projectId);
            console.log('Project name:', projectName);
            console.log('Project ID: ', projectId);
        } catch (error) {
            console.error("Error fetching project name:", error);
        }
    };

    useEffect(() => {
        fetchProjectName();
    }, [taskId]);


    const fetchSentences = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/tasks/${taskId}`);
            setSentences(response.data);
        } catch (error) {
            console.error('Error fetching sentences:', error);
        }
    };

    useEffect(() => {
        fetchSentences();
    }, [taskId]);

    useEffect(() => {
        // Initialize question status based on number of sentences
        setQuestionStatus(new Array(sentences.length).fill('not_attempted'));
    }, [sentences]);

    useEffect(() => {
        if (sentences.length > 0) {
            const currentSentence = sentences[currentSentenceIndex];
            const initialAnswers = {
                incorrect_word_choice: currentSentence.incorrect_word_choice,
                tense_error: currentSentence.tense_error,
                gnp_error: currentSentence.gnp_error,
                contextual_error: currentSentence.contextual_error,
                tone: currentSentence.tone,
                voice_error: currentSentence.voice_error,
                punctuation: currentSentence.punctuation,
                addition: currentSentence.addition,
                omission: currentSentence.omission,
                rentention: currentSentence.rentention,
                unnatural: currentSentence.unnatural,
                spelling_typological: currentSentence.spelling_typological,
                ne: currentSentence.ne,
                inconsistency: currentSentence.inconsistency,
                mistranslation: currentSentence.mistranslation,
                part_of_speech: currentSentence.part_of_speech,
                function_words: currentSentence.function_words,
                fluency: currentSentence.fluency,
                coherence: currentSentence.coherence,
                connectives: currentSentence.connectives,
                terminology: currentSentence.terminology,

                // status: currentSentence.status
            };
            setAnswers(initialAnswers);
            setSelectedNumber(currentSentence.selectedNumber || null); // Set selected number
        }
    }, [currentSentenceIndex, sentences]);



    const [errorsSubmitted, setErrorsSubmitted] = useState(false);
    const [sqmSubmitted, setSqmSubmitted] = useState(false);
    const handleAnswerChange = (key, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [key]: prevAnswers[key] === value ? null : value
        }));

        updateQuestionStatus(currentSentenceIndex, 'attempted');

        // Check if any error is selected to set errorsSubmitted
        const anyErrorSelected = Object.values({
            ...answers,
            [key]: value
        }).some(val => val !== null);
        setErrorsSubmitted(anyErrorSelected);
    };

    const updateQuestionStatus = (index, status) => {
        setQuestionStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = status;
            return newStatus;
        });
    };

    const handlePrevious = () => {
        setCurrentSentenceIndex(prevIndex => {
            updateQuestionStatus(prevIndex, answers ? 'attempted' : 'attempting');
            return Math.max(prevIndex - 1, 0);
        });
    };

    const handleNext = () => {
        setCurrentSentenceIndex(prevIndex => {
            updateQuestionStatus(prevIndex, answers ? 'attempted' : 'attempting');
            return Math.min(prevIndex + 1, sentences.length - 1);
        });
        console.log(sentences[currentSentenceIndex]);
    };

    const resetProgress = () => {
        setProgress(0);
    };

    const updateProgress = (updatedSentences) => {
        const completedSentences = updatedSentences.filter(sentence => sentence.done);
        const progressValue = updatedSentences.length === 0 ? 0 : Math.round((completedSentences.length / updatedSentences.length) * 100);
        setProgress(progressValue);
        console.log('Updated Sentences:', updatedSentences);
        console.log('Completed Sentences:', completedSentences);
        console.log('Progress Value:', progressValue);
        setProgress(progressValue);
    };


    const handleSubmit = async () => {
        try {
            if (errorsSubmitted && sqmSubmitted) {
                const response = await axios.post('http://localhost:5002/api/updateAnswers', {
                    userId,
                    sentenceId: sentences[currentSentenceIndex]._id,
                    answers,
                    selectedNumber
                });

                // Update local state to mark the sentence as done
                setSentences(prevSentences => {
                    const updatedSentences = [...prevSentences];
                    updatedSentences[currentSentenceIndex] = {
                        ...updatedSentences[currentSentenceIndex],
                        done: true
                    };
                    return updatedSentences;
                });

                // Update color of the sentence grid number to green
                handleColorChange(sentences[currentSentenceIndex]._id, 'green');
                await axios.post('http://localhost:5002/api/resetColor/', {
                    id: sentences[currentSentenceIndex]._id,
                });

                // Update question status (optional)
                updateQuestionStatus(currentSentenceIndex, 'attempted');

                alert('Answers submitted successfully');
                fetchSentences();
                setCurrentSentenceIndex(prevIndex => Math.min(prevIndex + 1, sentences.length - 1));
            } else {
                alert('Please submit both errors and SQM (Sentence Quality Metric) to proceed.');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    const updateColor = async (sentenceId, color) => {
        try {
            const response = await fetch('/api/updateColor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentenceId, color }),
            });
            const data = await response.json();
            console.log('Color updated successfully:', data.updatedSentence);
            // Optionally update local state or notify user of success
        } catch (error) {
            console.error('Error updating color:', error);
            // Handle error scenario
        }
    };


    const handleGoToSentence = () => {
        const index = parseInt(sentenceIndexInput, 10) - 1; // Convert to 0-based index
        if (index >= 0 && index < sentences.length) {
            setCurrentSentenceIndex(index);
        } else {
            alert('Sentence index out of range');
        }
    };

    // Effect to scroll to top when currentSentenceIndex changes

    const [selectedNumber, setSelectedNumber] = useState(null);



    const handleNumberChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setSelectedNumber(value);

        // Set sqmSubmitted to true when selecting SQM
        setSqmSubmitted(true);
    };



    // Example usage where color is updated
    const handleColorChange = async (sentenceId, newColor) => {
        // Update local state or UI with newColor
        // Call updateColor function to save color to backend
        updateColor(sentenceId, newColor);
    };


    return (
        <Container component="main" maxWidth="md" sx={{ mt: 5, border: 'none'/*backgroundColor: 'beige' */ }}>
            {userId === undefined ? <Typography sx={{ alignItems: 'left', ml: '-200px', fontSize: '17px' }}> <Link to={`/admin`}>Home</Link>/<Link to={`/admin/dashboard/${projectId}`}>{projectName}</Link>/{taskName}/{currentSentenceIndex + 1}</Typography> : <Typography sx={{ alignItems: 'left', ml: '-200px', fontSize: '17px' }}> <Link to={`/user/${userId}`}>Home</Link>/<Link to={`/user/${userId}`}>{projectName}</Link>/{taskName}/{currentSentenceIndex + 1}</Typography>}
            {/* <Typography sx={{ alignItems: 'left', ml: '-200px',fontSize:'17px' }}> <Link to={`/user/${userId}`}>Home</Link>/{projectName}/{taskName}/{currentSentenceIndex + 1}</Typography> */}

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6, mt: -4, /*backgroundColor: 'beige' */ }}>
                <img src={Logo} alt="College Logo" style={{ height: 60, marginRight: 50 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    MiDAS Evaluation Tool
                </Typography>

            </Box>
            <Divider sx={{ mt: -5 }} />

            {sentences.length > 0 && (
                //<Paper elevation={3} sx={{ padding: 3, mt: 0, border: 'none', boxShadow: 'none', backgroundColor: 'beige' }}>
                <Grid >


                    <Grid >
                        <Typography variant='body1' gutterBottom sx={{ ml: 90 }}>
                            <h4 style={{ marginRight: '3px', marginLeft: '50px', marginTop: '30px', marginBottom: '-30px', p: '2px' }}>Guidelines </h4>

                        </Typography>
                        <Typography><a href="http://localhost:5002/Domain_Extraction.pdf" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '890px', fontSize: '18px', fontFamily: 'bold', fontWeight: '10px', mt: '-50px' }}>i</a>
                        </Typography>

                    </Grid>


                    {/* translation start*/}
                    <Grid >
                        <Grid sx={{ ml: '-250px', mt: '-200px' }}>
                            <Grid >
                                <Paper elevation={3} sx={{ p: 2, width: '420px', height: '200px', mt: 20, mb: -1, backgroundColor: 'beige', display: 'flex', flexDirection: 'column', overflow: 'auto' }} ref={translationPaperRef}>
                                    <Typography variant="body1" gutterBottom>
                                        <h5>Source</h5>
                                        {sentences[currentSentenceIndex].english}                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sx={{ mb: -9 }}>
                                <Paper elevation={3} sx={{ p: 2, width: '420px', height: '210px', mt: 5, mb: 10, backgroundColor: 'beige', display: 'flex', flexDirection: 'column', overflow: 'auto' }} ref={sourcePaperRef}>
                                    <Typography variant="body1" gutterBottom>
                                        <h5>Translation</h5>
                                        
                                        {sentences[currentSentenceIndex].hindi}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* translation end */}

                        {/* /*error start*/}
                        <Grid container alignItems="center" justifyContent="center" sx={{ mr: 40, ml: -30, mt: -71 }} >
                            <Grid item xs={19}>
                                <Grid container spacing={2} alignItems="right" justifyContent="flex-end">
                                    <Grid item xs={2}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '20px', mr: 40, pl: -15, pr: 2 }} gutterBottom>
                                            Errors:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{ pl: 0, textAlign: 'right' }}>
                                        <Typography variant="body2" align="center" sx={{ marginLeft: 3, fontWeight: 'bold' }}>Low</Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{ pl: 10, textAlign: 'right' }}>
                                        <Typography variant="body2" align="center" sx={{ marginLeft: 1, fontWeight: 'bold' }}>Medium</Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{ pl: 9, textAlign: 'right' }}>
                                        <Typography variant="body2" align="center" sx={{ marginLeft: 0.3, fontWeight: 'bold' }}>High</Typography>
                                    </Grid>
                                </Grid>
                                <Grid sx={{ overflowX: 'auto', maxHeight: '525px' }}>
                                    <Grid container spacing={0} >
                                        {Object.entries(answers).map(([key, value]) => (
                                            <Grid container item xs={12} key={key} alignItems="center" justifyContent="flex-end" sx={{ mt: 0, marginTop: 0, marginBottom: 0 }}>
                                                <Grid item xs={2}>
                                                    <FormControl component="fieldset">
                                                        <FormLabel component="legend">{key}</FormLabel>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={1} sx={{ pl: 4, marginTop: 0, marginBottom: 0 }}>
                                                    <RadioGroup
                                                        value={value || ''}
                                                    >
                                                        <FormControlLabel
                                                            value="low"
                                                            control={<Radio size="small" />}
                                                            label=""
                                                            sx={{ marginLeft: 2, marginRight: 6 }}
                                                            onClick={() => handleAnswerChange(key, 'low')}
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                                <Grid item xs={1} sx={{ pl: 9, marginTop: 0, marginBottom: 0 }}>
                                                    <RadioGroup
                                                        value={value || ''}
                                                    >
                                                        <FormControlLabel
                                                            value="medium"
                                                            control={<Radio size="small" />}
                                                            label=""
                                                            sx={{ marginLeft: -4, marginRight: 3 }}
                                                            onClick={() => handleAnswerChange(key, 'medium')}
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                                <Grid item xs={1} sx={{ pl: 9, marginTop: 0, marginBottom: 0 }}>
                                                    <RadioGroup
                                                        value={value || ''}
                                                    >
                                                        <FormControlLabel
                                                            value="high"
                                                            control={<Radio size="small" />}
                                                            label=""
                                                            sx={{ marginLeft: -4, marginRight: 0 }}
                                                            onClick={() => handleAnswerChange(key, 'high')}
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/*error close*/}
                    </Grid>

                    {/* jee main */}
                    <Grid sx={{ ml: '700px', mt: '-520px' }}>
                        <Grid container spacing={1} alignItems="center" sx={{ maxHeight: 300, overflowY: 'auto', width: '350px' }}>
                            {sentences.map((sentence, index) => (
                                <Grid item key={index}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor:
                                                sentences[index].status === 'attempted'
                                                    ? 'green'
                                                    : sentences[index].status === 'attempting'
                                                        ? 'orange'
                                                        : 'gray'
                                        }}
                                        onClick={() => setCurrentSentenceIndex(index)}
                                    >
                                        {index + 1}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    {/*jee end*/}

                    <Box sx={{ padding: 5, mt: 5, mb: 50, mr: -10, ml: 82, width: '350px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" value={progress} />
                                <Typography variant="body1" sx={{ mt: 1, fontSize: '18px' }}>
                                    <b> Progress:</b> {progress}%,<span> {completedSentences.length}/{sentences.length}<span>   done</span></span>
                                </Typography>
                            </Box>
                        </Box>



                    </Box>

                    {/* <div>

                                    <button onClick={resetBackendAndProgress}>Reset Backend and Progress</button>
                                </div> */}

                    {/* /*end*/}



                    <Grid container spacing={2} mb='30px'>
                        <Grid item xs={2} sx={{ mt: '-380px', mr: '-900px', ml: '689px' }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handlePrevious}
                                disabled={currentSentenceIndex === 0}
                            >
                                Previous
                            </Button>
                        </Grid>
                        <Grid item xs={2} sx={{ mt: '-380px', ml: '835px', height: '80px', width: '-890px', fontSize: '2px' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ width: '150px' }}// Call handleSubmit function on button click
                            >
                                Save and Next
                            </Button>
                        </Grid>

                        <Grid item xs={8} sx={{ width: '30px', mt: '-20' }} >
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={currentSentenceIndex === sentences.length - 1}
                                sx={{ mt: '-738px', px: '30px', ml: '1000px', mb: '15px', width: '100px', height: '35px' }}
                            >
                                <span>     Next    </span>
                            </Button>
                        </Grid>

                    </Grid>

                </Grid >
                //</Paper>
            )
            }
            {/* sqm start */}
            <Grid container display='flex' justifyContent='flex-start' marginLeft='-250px' position='fixed'>
                <Grid item sx={{ ml: '10px', display: 'flex', mt: '-455px' }}>
                    <FormLabel component="legend" sx={{ fontSize: '20px', fontFamily: 'bold' }}>SQM </FormLabel>
                    <Tooltip
                        title={
                            <Typography sx={{ fontSize: 16 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div>0 - Nonsense</div>
                                    <div>2 - Less meaning + Bad Grammar</div>
                                    <div>4 - Most meaning + Some Grammar Error</div>
                                    <div>6 - Perfect</div>
                                </div>
                            </Typography>
                        }
                        arrow
                    >
                        <Typography sx={{ cursor: 'pointer', fontSize: '20px' }}>(i)</Typography>
                    </Tooltip>
                </Grid>
                <Grid item sx={{ mt: '-462px' }} >
                    <RadioGroup row>
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                            <FormControlLabel
                                key={num}
                                value={num}
                                control={
                                    <Radio
                                        checked={selectedNumber === num}
                                        onChange={handleNumberChange}
                                        value={num}
                                    />
                                }
                                label={num.toString()}
                                labelPlacement="bottom"
                                sx={{ m: -0.2, paddingBottom: -1 }}
                            />
                        ))}
                    </RadioGroup>
                </Grid>
            </Grid>
            {/* sqm end */}
        </Container >
    );
};

export default UserPage;
