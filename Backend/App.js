// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const SentencePairModel = require('./models/SentencePair');
const ProjectModel = require('./models/Projects');
const TaskModel = require('./models/Tasks');
const UserModel = require('./models/Users');
// const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const { Domain } = require('@mui/icons-material');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

mongoose.connect('mongodb+srv://root:root@cluster0.cupznfi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));

app.post('/api/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = new UserModel({
            username,
            email,
            password,
            role
        });
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error signing up', error });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username, password });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Route to fetch all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await ProjectModel.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Endpoint to fetch project details by projectId
app.get('/api/projects/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId).populate({
            path: 'tasks',
            populate: {
                path: 'data'
            }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
});
app.get('/api/projects/:projectId/name', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId);
        console.log(project.project_name);
        if (!project) {
            return res.status(404).json({ message: 'project not found' });
        }

        res.status(200).json({ project_name: project.project_name });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
});
// app.post('/api/projects/user/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Fetch projects assigned to the user
//         const userProjects = await ProjectModel.find({ assignedUsers: userId, }).populate('tasks');

//         if (!userProjects || userProjects.length === 0) {
//             return res.status(404).json({ message: 'No projects found for this user' });
//         }

//         // Format the response to include tasks within each project
//         const projects = userProjects.map(project => ({
//             projectId: project._id,
//             projectName: project.name,
//             tasks: project.tasks.map(task => ({
//                 _id: task._id,
//                 task_name: task.name
//             }))
//         }));

//         res.status(200).json(projects);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching projects and tasks', error });
//     }
// });
// app.get('/api/projects/user/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const userProjects = await ProjectModel.find({ assignedUsers: mongoose.Types.ObjectId(userId) });

//         if (!userProjects || userProjects.length === 0) {
//             return res.status(404).json({ message: 'No projects found for this user' });
//         }

//         res.status(200).json(userProjects);
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         res.status(500).json({ message: 'Error fetching projects', error });
//     }
// });
// app.get('/api/projects/user/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         console.log(userId)

//         // Convert userId to ObjectId
//         const objectId = mongoose.Types.ObjectId(userId);
//         console.log(objectId)

//         // Find projects assigned to the user
//         const userProjects = await ProjectModel.find({ assignedUsers: objectId }).populate('tasks');

//         if (!userProjects || userProjects.length === 0) {
//             return res.status(404).json({ message: 'No projects found for this user' });
//         }

//         // Map projects to include project ID, name, and tasks
//         const projects = userProjects.map(project => ({
//             projectId: project._id,
//             projectName: project.project_name,
//             tasks: project.tasks.map(task => ({
//                 taskId: task._id,
//                 taskName: task.task_name
//             }))
//         }));

//         res.status(200).json(projects);
//     } catch (error) {
//         console.error('Error fetching projects and tasks:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
// app.get('/api/projects/user/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Find projects assigned to the user
//         const userAllTasks = await TaskModel.find({ assigne: userId });



//         console.log(userId);

//         console.log(userAllTasks.length);



//         userAllTasks.forEach(item => {
//             console.log(item.project_id);
//             console.log(item.project_name);// Outputs each item in the list: A, B, C
//         });




//         // Return the projects in the response
//         res.status(200).json(projects);
//     } catch (error) {
//         console.error('Error fetching projects and tasks:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


app.get('/api/projects/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find tasks assigned to the user
        const userAllTasks = await TaskModel.find({ assigne: userId });

        // Extract unique project IDs from tasks
        const projectIds = [...new Set(userAllTasks.map(task => task.project_id))];
        console.log(projectIds);
        // Find project names based on the unique project IDs
        const userProjectsNames = await ProjectModel.find({ _id: { $in: projectIds } });

        // Map projects to include tasks under each project
        const projectsWithTasks = userProjectsNames.map(project => {
            const tasks = userAllTasks.filter(task => task.project_id.toString() === project._id.toString());
            return {
                projectName: project.project_name,
                tasks: tasks.map(task => ({
                    taskId: task._id,
                    taskName: task.task_name // Assuming your TaskModel has a task_name field
                }))
            };
        });

        // Log user ID and projects with tasks fetched
        console.log(userId);
        console.log(projectsWithTasks);

        // Return the projects with tasks in the response
        res.status(200).json(projectsWithTasks);
    } catch (error) {
        console.error('Error fetching projects and tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/projects/:projectId/tasks', async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log(projectId);
        // Find tasks for the specified project
        const projectTasks = await TaskModel.find({ project_id: projectId });

        if (!projectTasks || projectTasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this project' });
        }

        res.status(200).json({ tasks: projectTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to create a new project
app.post('/api/createProject', async (req, res) => {
    try {
        const { name, domain } = req.body;
        console.log(name, domain);
        const newProject = new ProjectModel({ project_name: name, project_type: domain });
        console.log(newProject);


        newProject.save();
        console.log('saved');
        res.json({ projectId: newProject._id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating project1' });
    }
});
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.post('/api/upload', async (req, res) => {
    const { data, task_name, projectId } = req.body;
    console.log(req.body);
    try {
        // Find the project by its ID
        const project = await ProjectModel.findById(projectId);
        console.log(project);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const newTask = new TaskModel({
            // data,
            task_name: task_name,
            project_id: projectId,
            project_name: project.project_name,
        });
        console.log(newTask);
        await newTask.save();

        project.tasks.push(newTask._id);
        await project.save();

        const sentencePairs = data.map(pair => ({
            english: pair.english,
            hindi: pair.hindi,
            task: newTask._id,
            user: null,
            index: pair.index
        }));

        const insertedPairs = await SentencePairModel.insertMany(sentencePairs);

        const sentencePairIds = insertedPairs.map(pair => pair._id);
        newTask.data.push(...sentencePairIds);
        await newTask.save();

        res.send('Data uploaded');
    } catch (error) {
        console.error(error);
        res.status(400).send('Validation failed');
    }
    console.log(res);
});



{/*i commented this*/ }
// Route to assign a user to a task
app.put('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params; // Extract taskId from req.params
    const { userId } = req.body;// Extract userId and project_name from req.body
    console.log(req.body);

    try {
        // Validate taskId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = await TaskModel.findById(taskId);
        // const users = await UserModel.find({}, '_id'); // Fetch all users and only return the _id field

        // // Extract the IDs from the users array
        // const userIds = users.map(users => users._id);
        // console.log(userIds);
        const user = await UserModel.findById(userId);
        console.log(userId);
        console.log(user);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log(`Received taskId: ${task._id}`);

        console.log(`Found task with ID: ${task._id}`);
        console.log(user._id);
        task.assigne = user._id;
        console.log(task.assigne);
        await task.save();

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get sentences for a specific user
app.get('/api/sentences/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await TaskModel.find({ assigne: userId }).populate('data');
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error2' });
    }
});
// Backend endpoint to update color for a sentence
app.post('/api/updateColor', async (req, res) => {
    const { sentenceId, color } = req.body;

    try {
        // Find and update the sentence color in your MongoDB collection
        const updatedSentence = await SentencePairModel.findByIdAndUpdate(sentenceId, { color }, { new: true });

        if (!updatedSentence) {
            return res.status(404).json({ message: 'Sentence not found' });
        }

        res.status(200).json({ message: 'Sentence color updated successfully', updatedSentence });
    } catch (error) {
        console.error('Error updating sentence color:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get sentences for a specific task
app.get('/api/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await TaskModel.findById(taskId).populate('data');
        //const sentences = task.data.map(sentence => ({
        // english: sentence.english,
        //   hindi: sentence.hindi
        //   }));
        // res.json(sentences);
        res.json(task.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error3' });
    }
});
app.get('/api/tasks/:taskId/name', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ task_name: task.task_name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/users/:userId/name', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user_obj = await UserModel.findById(userId);
        if (!user_obj) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user_role: user_obj.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/tasks/:taskId/projectname', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        // Fetch the task to get the project ID
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log("Task Details for fetching the project id and name");
        console.log(task);
        // Assuming the task has a projectId field
        const projectId = task.project_id;
        if (!projectId) {
            return res.status(404).json({ message: 'Project ID not found in task' });
        }

        // Fetch the project to get the project name
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // console.log('Project:', project); // Debug statement to inspect the project object
        console.log('Project Name:', project.project_name); // Debug statement for project_name
        res.json({ project_name: project.project_name, proj_id: projectId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/tasks/:taskId/:', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ task_name: task.task_name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// delete a task
app.delete('/api/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        await TaskModel.deleteOne({ _id: taskId });
        await SentencePairModel.deleteMany({ task: taskId });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error4' });
    }
});


// Update answers for a specific sentence
// app.post('/api/updateAnswers', async (req, res) => {
//     const { userId, sentenceId, answers, selectedNumber } = req.body;
//     console.log(userId, sentenceId, answers, selectedNumber);
//     try {
//         await SentencePairModel.findByIdAndUpdate(sentenceId, {
//             $set: { ...answers, selectedNumber },
//             done: true
//         });
//         res.status(200).json({ message: 'Answers updated successfully' });
//     } catch (error) {
//         console.error('Error updating answers:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

app.post('/api/updateAnswers', async (req, res) => {
    const { userId, sentenceId, answers, selectedNumber } = req.body;

    // Check if selectedNumber is present and non-null
    if (selectedNumber === null) {
        return res.status(400).json({ error: 'SQM (selectedNumber) must be submitted.' });
    }

    // Check if at least one error type is submitted
    const errorTypes = Object.values(answers);
    const anyErrorSubmitted = errorTypes.some(value => value !== null);

    if (!anyErrorSubmitted) {
        return res.status(400).json({ error: 'At least one error type must be submitted.' });
    }

    try {
        // Update the document in your MongoDB collection
        await SentencePairModel.findByIdAndUpdate(sentenceId, {
            ...answers,
            selectedNumber,
            done: true,
            status: 'attempted'// Assuming 'done' field needs to be set to true
        });

        res.status(200).json({ message: 'Answers updated successfully' });
    } catch (error) {
        console.error('Error updating answers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





// app.post('/api/saveProgress', async (req, res) => {
//     const { userId, taskId, completedSentences, taskProgress } = req.body;
//     console.log('Saving progress:', { userId, taskId, completedSentences, taskProgress });

//     try {
//         const task = await TaskModel.findOneAndUpdate(
//             { assigne: userId, _id: taskId },
//             { completedSentences, taskProgress },
//             { new: true }
//         );
//         if (!task) {
//             console.error('Task not found for saving progress');
//             return res.status(404).json({ message: 'Task not found' });
//         }
//         console.log('Progress saved successfully:', task);
//         res.json(task);
//     } catch (error) {
//         console.error('Error saving progress:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
app.post('/api/saveProgress', async (req, res) => {
    const { userId, taskId, completedSentences, taskProgress } = req.body;
    console.log('Saving progress:', { userId, taskId, completedSentences, taskProgress });

    try {
        const task = await TaskModel.findOneAndUpdate(
            { assigne: userId, _id: taskId },
            { completedSentences, taskProgress },
            { new: true }
        );
        if (!task) {
            console.error('Task not found for saving progress');
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log('Progress saved successfully:', task);
        res.json(task);
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/resetSentences', async (req, res) => {
    const { userId } = req.body;

    try {
        // Reset all sentences for the user
        await SentencePairModel.updateMany(
            { user: userId },
            { $set: { status: 'not_attempted', done: false, selectedNumber: 0, incorrect_word_choice: false, tense_error: false, gnp_error: false, contextual_error: false, tone: false, voice_error: false, punctuation: false, addition: false, omission: false, rentention: false, unnatural: false, spelling_typological: false, ne: false, inconsistency: false, mistranslation: false, part_of_speech: false, function_words: false, fluency: false, coherence: false, connectives: false, terminology: false } }
        );

        // Optionally, reset tasks progress if required
        await TaskModel.updateMany(
            { assigne: userId },
            { $set: { completedSentences: [], taskProgress: 0 } }
        );

        res.status(200).json({ message: 'Sentences and progress reset successfully' });
    } catch (error) {
        console.error('Error resetting sentences and progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/resetColor', async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
        // Reset all sentences for the user
        await SentencePairModel.updateOne(
            { index: id },
            { $set: { status: 'attempted', done: true } }

        );

        res.status(200).json({ message: 'Sentences and progress reset successfully' });
    } catch (error) {
        console.error('Error resetting progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const resetBackendAndProgress = async () => {
    try {
        // Send request to backend to reset sentences
        await axios.post('http://localhost:5002/api/resetSentences', {
            // Optionally pass userId if required by backend
            // userId: 'yourUserId',
        });

        // Reset local state in frontend
        setSentences([]);
        setProgress(0);

        alert('Backend and progress reset successfully');
    } catch (error) {
        console.error('Error resetting backend and progress:', error);
        alert('Failed to reset backend and progress');
    }
};


app.get('/api/progress/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    try {
        const task = await TaskModel.findOne({ assigne: userId, _id: taskId });
        if (task) {
            res.json({ completedSentences: task.completedSentences, taskProgress: task.taskProgress });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// app.post('/api/updateQuestionStatus', async (req, res) => {
//     const { userId, sentenceId, status } = req.body;

//     try {
//         const updatedSentence = await SentencePairModel.findByIdAndUpdate(
//             sentenceId,
//             { status },
//             { new: true }
//         );

//         if (!updatedSentence) {
//             return res.status(404).json({ message: 'Sentence not found' });
//         }

//         res.status(200).json({ message: 'Question status updated successfully', updatedSentence });
//     } catch (error) {
//         console.error('Error updating question status:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
app.post('/api/updateQuestionStatus', async (req, res) => {
    const { sentenceId, status } = req.body;

    try {
        const updatedSentence = await SentencePairModel.findByIdAndUpdate(
            sentenceId,
            { status },
            { new: true }
        );

        if (!updatedSentence) {
            return res.status(404).json({ message: 'Sentence not found' });
        }

        res.status(200).json({ message: 'Question status updated successfully', updatedSentence });
    } catch (error) {
        console.error('Error updating question status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Generate and download task report
// Route to download task report based on user ID and task ID
app.get('/api/downloadReport/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    try {
        // Fetch task data and user details
        const task = await TaskModel.findById(taskId).populate('data');
        const user = await UserModel.findById(userId);

        // Generate report data (dummy example)
        const reportData = task.data.map(sentence => ({
            English: sentence.english,
            Hindi: sentence.hindi,
            SQM_Score: sentence.selectedNumber || 'N/A',
            incorrect_word_choice: sentence.incorrect_word_choice || 'N/A',
            tense_error: sentence.tense_error || 'N/A',
            gnp_error: sentence.gnp_error || 'N/A',
            contextual_error: sentence.contextual_error || 'N/A',
            tone: sentence.tone || 'N/A',
            voice_error: sentence.voice_error || 'N/A',
            punctuation: sentence.punctuation || 'N/A',
            addition: sentence.addition || 'N/A',
            omission: sentence.omission || 'N/A',
            rentention: sentence.rentention || 'N/A',
            unnatural: sentence.unnatural || 'N/A',
            spelling_typological: sentence.spelling_typological || 'N/A',
            ne: sentence.ne || 'N/A',
            inconsistency: sentence.inconsistency || 'N/A',
            mistranslation: sentence.mistranslation || 'N/A',
            part_of_speech: sentence.part_of_speech || 'N/A',
            function_words: sentence.function_words || 'N/A',
            fluency: sentence.fluency || 'N/A',
            coherence: sentence.coherence || 'N/A',
            connectives: sentence.connectives || 'N/A',
            terminology: sentence.terminology || 'N/A',
            // User: user.username,
        }));

        // console.log('Report data:', reportData);

        // Convert report data to Excel file using XLSX library
        const XLSX = require('xlsx');
        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const reportBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=report_${userId}_${taskId}.xlsx`);

        // Send the report file as response
        res.send(reportBuffer);
    } catch (error) {
        console.error('Error downloading report:', error);
        res.status(500).json({ message: 'Internal server error6' });
    }
});
const port = 5002;
app.listen(port, () => console.log(`Server running on port ${port}`));
