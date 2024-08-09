
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import './styles.css';

const AdminDashboard = () => {
  const { projectId, taskId } = useParams();
  const [file, setFile] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState("");


  const fetchTasksAndUsers = async () => {
    try {
      const tasksResponse = await axios.get(`http://localhost:5002/api/projects/${projectId}`);
      tasksResponse.data.tasks.forEach(task => {
        task.completedSentences = task.data.filter(sentence => sentence.done);
        task.taskProgress = Math.floor((task.completedSentences.length / task.data.length) * 100);
      });
      setTasks(tasksResponse.data.tasks);

      const usersResponse = await axios.get("http://localhost:5002/api/users");
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching tasks or users:", error);
    }
  };

  useEffect(() => {
    fetchTasksAndUsers();
  }, [projectId]);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssignUser = async (taskId, userId) => {
    console.log(taskId);
    console.log(userId);

    try {



      await axios.put(`http://localhost:5002/api/tasks/${taskId}`, {
        userId,

      });
      fetchTasksAndUsers();
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };

  const handleTaskName = (e) => {
    setTaskName(e.target.value);
  };

  const handleUpload = async () => {
    console.log(projectId);
    if (file && taskName && projectId) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        console.log('file loaded');
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const extractedData = jsonData.slice(1).map((row) => ({
          index: row["S.NO."],
          english: row["English Sentence"],
          hindi: row["Hindi MT Outputs"],
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

        }));
        // console.log(extractedData);
        await axios.post("http://localhost:5002/api/upload", {
          data: extractedData,
          task_name: taskName,
          projectId,


        });
        // console.log(data);
        console.log('uploaded');
        alert("File uploaded successfully");
        fetchTasksAndUsers();
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please select a file and provide a task name.");
    }
  };
  const fetchProjectName = async (projectId, setProjectName) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/projects/${projectId}/name`);
      const projectName = response.data.project_name;
      setProjectName(projectName);
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectName(projectId, setProjectName);
    }
  }, [projectId]);
  const handleDownloadReport = async (userId, taskId) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/downloadReport/${userId}/${taskId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${userId}_${taskId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5002/api/tasks/${taskId}`);
      fetchTasksAndUsers();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <div>
        <Typography> <Link to={'/admin'}>Home</Link>/
          <Link to={'/admin'}> {projectName}</Link></Typography>
        <Typography variant="h6" gutterBottom>Existing Tasks</Typography>
        {tasks.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Task Name
                  </TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link to={`/admin/dashboard/${projectId}/task/${task._id}`}>{task.task_name}</Link>
                    </TableCell>
                    <TableCell>{task.data.length}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel>Select User</InputLabel>
                        <Select
                          value={task.assigne || ''}
                          onChange={(e) => handleAssignUser(task._id, e.target.value)}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                              {user.username}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {`${task.completedSentences.length}/${task.data.length} (${task.taskProgress}%)`}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownloadReport(task.assigne, task._id)}
                      >
                        Download Report
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No tasks available</Typography>
        )}
      </div>
      <div>
        <Typography variant="h6" gutterBottom>Create New Task</Typography>
        <input type="file" onChange={handleFileUpload} />
        <TextField
          label="Task Name"
          variant="outlined"
          value={taskName}
          onChange={handleTaskName}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
