import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sql from './src/configs/database.js'; 
import authRoutes from './src/routes/auth.js'; 
import userRoutes from './src/routes/user.js'; 
import updateUserRoutes from './src/routes/updateuser.js';
import addTaskRoutes from './src/routes/addtask.js';
import tasksAllRoutes from './src/routes/tasksall.js';
import updateTaskRoutes from './src/routes/updatetask.js';
import taskByNumRoutes from './src/routes/taskbynum.js'; 
import deleteTaskRoutes from './src/routes/deletetask.js'; 
import notificationRoutes from './src/routes/notification.js';
import sendEmailRoutes from './src/routes/sendemail.js';



const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Use the auth routes
app.use('/auth', authRoutes);

// Use the user routes
app.use('/user', userRoutes);

// Use the updateUser routes
app.use('/updateuser', updateUserRoutes);

// Use the tasks routes
app.use('/addtask', addTaskRoutes); 
app.use('/tasks', taskByNumRoutes); 
app.use('/tasks', tasksAllRoutes); 
app.use('/tasks', updateTaskRoutes);  
app.use('/tasks', deleteTaskRoutes);    

app.use('/notifications', notificationRoutes);

app.use('/api', sendEmailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
