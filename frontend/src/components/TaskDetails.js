// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import {
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
// } from "@mui/material";

// const TaskDetails = () => {
//     const { taskId } = useParams();
//     const [sentences, setSentences] = useState([]);

//     useEffect(() => {
//         const fetchTaskSentences = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5001/api/tasks/${taskId}`); // Make GET request to fetch sentences for the task ID
//                 setSentences(response.data);
//             } catch (error) {
//                 console.error("Error fetching task sentences:", error);
//             }
//         };

//         fetchTaskSentences();
//     }, [taskId]);

//     return (
//         <div>
//             <Typography variant="h4" gutterBottom>Task Details</Typography>
//             {sentences.length > 0 ? (
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Index</TableCell>
//                                 <TableCell>English Sentence</TableCell>
//                                 <TableCell>Hindi MT Output</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {sentences.map((sentence, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell>{sentence.index}</TableCell>
//                                     <TableCell>{sentence.english}</TableCell>
//                                     <TableCell>{sentence.hindi}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             ) : (
//                 <Typography>No sentences available for this task</Typography>
//             )}
//         </div>
//     );
// };

// export default TaskDetails;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
    const { taskId } = useParams();
    const [sentences, setSentences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSentences = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
                setSentences(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchSentences();
    }, [taskId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Task Details</h1>
            {sentences.length > 0 ? (
                <ul>
                    {sentences.map((sentence, index) => (
                        <li key={index}>
                            <strong>English:</strong> {sentence.english} <br />
                            <strong>Hindi:</strong> {sentence.hindi}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No sentences found for this task.</p>
            )}
        </div>
    );
};

export default TaskDetails;
