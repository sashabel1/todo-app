# 📝 Full-Stack Task Manager (MERN)

> 🚧 **Status: Under Construction** 🚧  
> *This project is currently in active development. The foundational MERN stack architecture has been set up, and features are being rolled out iteratively.*

## 📖 About The Project

A comprehensive, full-stack To-Do List application designed for ultimate productivity. Built with the MERN stack (MongoDB, Express, React, Node.js), this application goes beyond simple task management by offering smart time-based filtering, custom dynamic categories, and personal progress tracking.

## ✨ Planned Features

### 🔐 Authentication & Onboarding
* **Landing Page:** A clean, welcoming entry point with quick access to Login and Signup.
* **User Accounts:** Secure registration and login system. Each user has their own private workspace and custom categories.

### 📋 Smart Dashboard
* **Dynamic Sidebar Menu:** * Built-in time filters: View tasks for *Today*, *This Week*, *This Month*, or *This Year*.
  * Custom Categories: Users can create custom tags (e.g., "Work", "Studies"). The sidebar dynamically updates to include these as filterable options.
* **Task View:** A clean interface showing pending tasks with their titles and due dates.
* **Task Details (Modal):** Clicking a task opens a dedicated modal overlay to view the full description, color code, and metadata without leaving the main dashboard.

### ⚙️ Task Management (CRUD)
* **Create:** Add new tasks with a title, optional description, due date, color tag, and custom category. (Tasks can also be created without a strict deadline).
* **Read:** View and filter tasks seamlessly.
* **Update:** Edit task details or mark them as completed with a single click.
* **Delete:** Remove tasks from the system permanently.

### 📊 User Profile & Statistics
* **Account Info:** View and manage personal login details.
* **Progress Tracking:** A visual progress bar (Red/Green) and numerical breakdown showing:
  * Total created tasks
  * Completed tasks
  * Pending tasks

## 💻 Tech Stack

* **Frontend:** React.js (via Vite), React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas), Mongoose
* **Tools:** Axios (API requests), date-fns (Date manipulation)


