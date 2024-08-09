# MeiTY Bhashini Project - MiDAS Evaluation Tool

## Overview

This project is an evaluation tool developed using the MERN stack (MongoDB, Express, React, Node.js). The tool is designed to collect human data for machine translation, with the main objective of identifying translation quality. The model will be trained on benchmark data, and the tool provides both admin and user interfaces to manage tasks related to this evaluation process.

## Features

### Admin Features:
- **Upload Task**: Admins can upload new tasks to the system.
- **Assign Task**: Admins can assign tasks to users.
- **Track Progress**: Admins can track the progress of assigned tasks.
- **View Task Page**: Admins can view the task pages completed by users to date.

### User Features:
- **View Assigned Tasks**: Users can view tasks assigned to them.

## Installation

### Prerequisites
- Ensure you have **Node.js** installed on your machine.

### Frontend Setup
1. Navigate to the frontend directory.
2. Run the following commands to install necessary packages and initialize npm:
    ```bash
    npm install 
    npm init -y
    ```
3. Install React Router DOM for handling routing:
    ```bash
    npm install react-router-dom
    ```

### Backend Setup
1. Navigate to the backend directory.
2. Run the following commands to install necessary packages:
    ```bash
    npm install express mongoose
    ```

## Running the Application

### Frontend
1. In the frontend directory, start the application by running:
    ```bash
    npm start
    ```
2. The site will open on `http://localhost:3000`.

### Backend
1. In the backend directory, start the server by running:
    ```bash
    node app.js
    ```

## Conclusion
The MeiTY Bhashini Project's Evaluation Tool is a powerful system for evaluating machine translation quality through human input. This tool ensures accurate and reliable training of translation models, helping to improve translation performance.

