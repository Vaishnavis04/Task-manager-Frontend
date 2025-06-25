# Task Manager MERN Project

This is a full-stack Task Manager web application built using the **MERN stack**: MongoDB, Express.js, React.js, and Node.js. The project allows users to register, log in, manage their tasks, and includes an admin panel to manage users.

---

## 📌 What the Project Does

The Task Manager app has two types of users: regular users and admins.

### For Regular Users:
- Register and log in securely.
- View a dashboard with their tasks.
- Add new tasks.
- Delete completed or unwanted tasks.
- Receive confirmation or notification emails.

### For Admins:
- Log in with admin privileges.
- View a list of all registered users.
- Change user roles (make a user an admin or revert to user).
- View task statistics (optional feature with charts).

---

## 🛠 Technologies Used

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB using Mongoose
- **Authentication:** JWT (JSON Web Tokens), Bcrypt for password hashing
- **Email Service:** Nodemailer with Gmail SMTP
- **Deployment:** Vercel (for frontend), Render (for backend)

---

## 🔧 How It Works

### Authentication
Users sign up or log in. Passwords are securely hashed before saving to the database. After logging in, users receive a JWT token which is stored in the browser and used to access protected routes.

### Admin Dashboard
Admins have access to a special panel where they can manage user data, including viewing users and changing their roles. Only users with the 'admin' role can access these features.

### Task Management
Users can add tasks to their personal task list and remove them once completed. Tasks are stored in a MongoDB collection.

### Email Notifications
Emails are sent using Gmail’s SMTP service via Nodemailer. This is configured using environment variables and Google App Passwords.

---

## 🧾 Project Setup

### Backend Environment Variables (.env)
```
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Ecomm
JWT_SECRET=your_jwt_secret

```

### Frontend Environment Variables (.env)
```
REACT_APP_API_URL=https://task-manager-ypqt.onrender.com
```

---

## 🌐 Deployment

### Backend (Render)
1. Push backend code to GitHub.
2. Create a new Render Web Service.
3. Set up environment variables.
4. Use `npm install` as the build command.
5. Use `node server.js` or `npm start` as the start command.

### Frontend (Vercel)
1. Push frontend code to GitHub.
2. Import into Vercel.
3. Set environment variable `REACT_APP_API_URL` to the Render backend URL.
4. Set build command as `npm run build`.
5. Output directory should be `build`.

---

## 👩‍💻 Author

Project created by **Vaishnavi Sakthivel** as part of a MERN stack learning journey.

---

## ✅ Summary

This project demonstrates how to build a secure, full-stack web application using modern JavaScript tools. It includes user authentication, role-based access, REST APIs, frontend routing, MongoDB integration, and deployment to cloud services.
