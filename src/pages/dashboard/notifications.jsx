import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasksForTomorrow = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notifications/test-tasks-tomorrow', {
          headers: { usr: localStorage.getItem('loggedInUser') }
        });
        if (response.data.success) {
          setTasks(response.data.data);
        } else {
          console.error('No tasks found for tomorrow');
        }
      } catch (error) {
        console.error('Failed to fetch tasks for tomorrow:', error);
      }
    };

    fetchTasksForTomorrow();
  }, []);

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <div id="heading-tit"><h2>Notification</h2></div>
      <Card>
        <CardHeader color="transparent" floated={false} shadow={false} className="m-0 p-4">
          <Typography variant="h5" color="blue-gray">
            Les tâches du demain a traiter 
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Alert key={index} color="green" icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}>
                <strong>{task.TSKOBJ} - {task.TSKSTA}</strong><br />
                Scheduled: {new Date(task.DATDEB).toLocaleDateString()} at {new Date(task.HURDEB).toLocaleTimeString()}<br />
                Client: {task.NOMCLI} ({task.CATCLI})
              </Alert>
            ))
          ) : (
            <Typography>No tasks scheduled for tomorrow.</Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
