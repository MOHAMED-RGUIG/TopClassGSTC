import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Textarea,
  Button,
  Option,
  Avatar,
} from "@material-tailwind/react";
import { EyeIcon, PencilIcon, TrashIcon,CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import Vatar from "@/pages/dashboard/vatar";
import Tables from "@/pages/dashboard/tables";
import axios from "axios";
import Chart from "react-apexcharts";

export function Home() {
  const [tasks, setTasks] = useState([]); // Store tasks fetched from the backend
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState("bg-blue-500");
  const [successMessage, setSuccessMessage] = useState("");
  const [statistics, setStatistics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  // Fetch tasks and calculate statistics
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const USR = localStorage.getItem("loggedInUser");
        const response = await axios.get("https://toptachesapi3.onrender.com/tasks/tasksall", {
          headers: { usr: USR },
        });

        if (response.data.success) {
          const fetchedTasks = response.data.data;

          // Calculate statistics
          const totalTasks = fetchedTasks.length;
          const completedTasks = fetchedTasks.filter(
            (task) => task.TSKSTA === "Réalisé"
          ).length;
          const pendingTasks = fetchedTasks.filter(
            (task) => task.TSKSTA === "À faire"
          ).length;

          setTasks(fetchedTasks);
          setStatistics({
            totalTasks,
            completedTasks,
            pendingTasks,
          });
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  const simulateProgress = (isDelete = false) => {
    setShowProgress(true);
    setProgress(0);
    setProgressColor(isDelete ? "bg-red-500" : "bg-blue-500");
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          setShowProgress(false);
          setSuccessMessage(isDelete ? "Task deleted successfully" : "Task updated successfully");
          return prev;
        }
      });
    }, 100);
  };

  const [chartData, setChartData] = useState({
    series: [50, 50], // Assuming equal split for demo
    options: {
      chart: {
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 5,
          color: '',
          opacity: 0.5
        }
      },
      labels: ["À Faire", "Réalisées"],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: '',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '15px',
                fontFamily: 'Poppins, sans-serif', // Changed to Poppins
                fontWeight: 400,
                color: undefined,
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif', // Changed to Poppins
                fontWeight: 400,
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontFamily: 'Poppins, sans-serif', // Changed to Poppins
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '16px',
        fontFamily: 'Poppins, sans-serif', // Changed to Poppins
        fontWeight: 400,
        markers: {
          width: 10,
          height: 10,
          strokeWidth: 0,
          strokeColor: '#fff',
          radius: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      colors: ['#183f7f', '#007f66'],// Yellow for 'À Faire', Blue for 'Réalisées'
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: [''], // Hide stroke lines
        width: 2,
        dashArray: 0,      
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#183f7f', '#007f66'], // Gradient to match base colors
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [0, 100]
        }
      }
    }
});



  
  const handleOpenViewDialog = async (task) => {
    try {
      const response = await axios.get(`https://toptachesapi3.onrender.com/tasks/taskbynum/${task.TSKNUM}`, {
        headers: { usr: localStorage.getItem("loggedInUser") },
      });
      console.log("API Response:", response.data); // Log the API response
      if (response.data && response.data.success) {
        setSelectedTask(response.data.data); // Set the task details from the response
        setOpenViewDialog(true);
      } else {
        console.error("Task not found or error fetching task details");
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleOpenEditDialog = async (task) => {
    try {
      const response = await axios.get(`https://toptachesapi3.onrender.com/tasks/taskbynum/${task.TSKNUM}`, {
        headers: { usr: localStorage.getItem("loggedInUser") },
      });

      console.log("Original times:", response.data.data.HURDEB, response.data.data.HURFIN);
  
      if (response.data.success) {
        const taskData = response.data.data;
        
        taskData.HURDEB = taskData.HURDEB ? taskData.HURDEB.slice(11, 16) : '';  
        taskData.HURFIN = taskData.HURFIN ? taskData.HURFIN.slice(11, 16) : '';  
  
        // No conversion necessary for ISO date strings (YYYY-MM-DD)
        taskData.DATDEB = taskData.DATDEB.slice(0, 10);
  
        setSelectedTask(taskData);
        setOpenEditDialog(true);
      } else {
        console.error("Task not found or error fetching task details");
        console.log("Failed to load task details: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      console.log("An error occurred while trying to fetch task details.");
    }
  };
  
  
  

  const handleOpenDeleteDialog = (task) => {
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatTime = (timeString) => {
    if (!timeString) {
      console.log("formatTime called with undefined or null");
      return '';
    }
    
    // Check if timeString is in the expected format
    console.log("Original time string:", timeString);
    
    try {
      const timeParts = timeString.split('T')[1].split(':'); // Assuming ISO string format
      const hours = timeParts[0];
      const minutes = timeParts[1];
  
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
  
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return date.toLocaleTimeString('en-US', options);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ''; // Return a default or empty string in case of error
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedTask) {
      alert("No task selected for update.");
      return;
    }
  
    try {
      const response = await axios.put(`https://toptachesapi3.onrender.com/tasks/updatetask/${selectedTask.TSKNUM}`, selectedTask, {
        headers: { usr: localStorage.getItem("loggedInUser") },
      });
  
      if (response.data.success) {
        alert("Task updated successfully");
        setOpenEditDialog(false);
        fetchTasks(); // Optionally refetch all tasks or update local state
      } else {
        alert("Failed to update task: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("An error occurred while updating the task.");
    }
    simulateProgress();
  };
  

  const handleChange = (e) => {
      const name = e.target ? e.target.name : e.name;
      const value = e.target ? e.target.value : e.value;

      setSelectedTask(prevState => {
          const updatedState = { ...prevState, [name]: value };
          console.log(`Updating ${name} to ${value}`, updatedState);
          return updatedState;
      });
  };

  const deleteTask = async () => {
    if (!selectedTask || !selectedTask.TSKNUM) {
      alert('Task number is missing, cannot delete.');
      return;
    }
  
    try {
      const response = await axios.delete(`https://toptachesapi3.onrender.com/tasks/${selectedTask.TSKNUM}`);
      if (response.data.success) {
        alert('Task deleted successfully');
        setOpenDeleteDialog(false);
        fetchTasks(); // Refetch the tasks list to reflect the changes
      } else {
        alert('Failed to delete the task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
    simulateProgress(true);
  };

  // Render action icons for each row
  const renderActionIcons = (task) => {
    return (
      <>
        <EyeIcon
          className="h-5 w-5 cursor-pointer text-yellow-500"
          onClick={() => {
            console.log("Opening dialog for task:", task);
            handleOpenViewDialog(task);
          }}
        />
        <PencilIcon
          className="h-5 w-5 cursor-pointer text-blue-500"
          onClick={() => handleOpenEditDialog(task)}
        />
        <TrashIcon
          className="h-5 w-5 cursor-pointer text-red-500"
          onClick={() => handleOpenDeleteDialog(task)}
        />
      </>
    );
  };

  return (
    <div className="">
    <Vatar/>
      <div className="mb-12 grid gap-y-6 gap-x-16 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard
          title="Total des tâches"
          value={statistics.totalTasks || 0}
          icon={<ClipboardIcon className="h-6 w-6 font-bold text-black-500" />}
          className="rounded-md shadow-lg tc-label"
          style={{
            borderRadius: "50px", 
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
        <StatisticsCard
          title="Les tâches réalisées"
          value={statistics.completedTasks || 0} 
          icon={<CheckCircleIcon className="h-6 w-6 font-bold text-black-500" />}
          className="rounded-md shadow-lg tc-label"
          style={{
            borderRadius: "50px", 
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" 
          }}
        />
        <StatisticsCard
          title="Les tâches à Faire"
          value={statistics.pendingTasks || 0}
          icon={<EyeIcon className="h-6 w-6 font-bold text-black-500" />}
          className="rounded-md shadow-lg tc-label"
          style={{
            borderRadius: "50px", 
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" 
          }}
        />
      </div>

      <div className="flex justify-center items-center mb-6">
        <Card className="w-full max-w-lg transform transition">
          <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
            <Typography variant="small" className="text-center font-normal text-blue-gray-600">
              Distribution des tâches
            </Typography>
          </CardHeader>
          <CardBody className="flex justify-center bg-white p-4 rounded-lg leading-normal">
            <Chart
              options={chartData.options}
              series={[statistics.pendingTasks || 0,statistics.completedTasks || 0]}
              type="donut"
              width="100%"
            />
          </CardBody>
        </Card>
      </div>

      {/* Task Table */}
<Tables/>
      {/*
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Mes Tâches
            </Typography>

            {/* Search Bar */}
          {/**  </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Task", "Client", "Date", "heure debut", "heure fin", "Status", "Action"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography variant="small" className="tc-label-table">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, key) => {
                  const className = `py-3 px-5 ${
                    key === tasks.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={key}>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="tc-label-table">
                          {task.TSKOBJ}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="tc-label-table">
                          {task.NOMCLI}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="tc-label-table">
                          {formatDate(task.DATDEB)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="tc-label-table">
                          {formatTime(task.HURDEB)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="tc-label-table">
                          {formatTime(task.HURFIN)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="tc-label-table">
                          {task.TSKSTA}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex gap-2">
                          {renderActionIcons(task)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
*/}
      {showProgress && (
        <Dialog open={showProgress} onClose={() => setShowProgress(false)}>
          <DialogHeader>{successMessage}</DialogHeader>
          <DialogBody>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor} transition-width duration-500`}></div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="gradient" color={progressColor === "bg-red-500" ? "red" : "blue"} onClick={() => setShowProgress(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} animate={{ mount: { scale: 1, opacity: 1 }, unmount: { scale: 0.9, opacity: 0 } }}>
        <DialogHeader>Détaile de la tâche</DialogHeader>
        <DialogBody divider style={{ overflowY: 'auto', maxHeight: '300px', padding: '10px' }}>
          {selectedTask ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Type de Tâche', value: selectedTask.TSKTYP },
                { label: 'Action de la Tâche', value: selectedTask.TSKACT },
                { label: 'Date de Début', value: formatDate(selectedTask.DATDEB) },
                { label: 'Heure de Début', value: formatTime(selectedTask.HURDEB) },
                { label: 'Heure de Fin', value: formatTime(selectedTask.HURFIN) },
                { label: 'Code Client', value: selectedTask.CLI },
                { label: 'Nom de Client', value: selectedTask.NOMCLI },
                { label: 'Catégorie', value: selectedTask.CATCLI },
                { label: 'Adresse de Client', value: selectedTask.ADRCLI },
                { label: 'Nom de Contact', value: selectedTask.NOMCNT },
                { label: 'Fonction de Client', value: selectedTask.FNCCNT },
                { label: 'Téléphone', value: selectedTask.TELCNT },
                { label: 'Objet de la Tâche', value: selectedTask.TSKOBJ },
                { label: 'Compte Rendu', value: selectedTask.TSKCMR },
                { label: 'Statut', value: selectedTask.TSKSTA }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)', padding: '8px', borderRadius: '8px' }}>
                  <Typography variant="small">{item.label}:</Typography>
                  <span style={{ maxWidth: '65%', overflowWrap: 'break-word' }}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <Typography>No task selected</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="blue" onClick={() => setOpenViewDialog(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogHeader>Modifier la tâche</DialogHeader>
        <DialogBody divider style={{ overflowY: 'scroll', maxHeight: '300px' }}>
          {selectedTask && (
            <form className="flex flex-col gap-4">
              <Select label="Type de Tâche" name="TSKTYP" value={selectedTask.TSKTYP} onChange={(value) => handleChange({ name: 'TSKTYP', value })} className="tc-text-input">
                <Option value="Réunion Commercial">Réunion Commercial</Option>
                <Option value="Visite Client">Visite Client</Option>
                <Option value="Prospection">Prospection</Option>
                <Option value="Recouvrement">Recouvrement</Option>
                <Option value="Formation">Formation</Option>
                <Option value="Séminaire">Séminaire</Option>
                <Option value="Salon">Salon</Option>
                <Option value="Règlement de litiges">Règlement de litiges</Option>
              </Select>
              <Select label="Action de la Tâche" name="TSKACT" value={selectedTask.TSKACT} onChange={(value) => handleChange({ name: 'TSKACT', value })} className="tc-text-input">
                <Option value="Action 1">Action 1</Option>
                <Option value="Action 2">Action 2</Option>
                <Option value="Action 3">Action 3</Option>
              </Select>
              <Input type="date" label="Date de Début" name="DATDEB" value={selectedTask.DATDEB} onChange={handleChange} className="tc-text-input" />
              <Input type="time" label="Heure de Début" name="HURDEB" value={selectedTask.HURDEB} onChange={handleChange} className="tc-text-input" />
              <Input type="time" label="Heure de Fin" name="HURFIN" value={selectedTask.HURFIN} onChange={handleChange} className="tc-text-input" />
              <Input label="Code Client" name="CLI" value={selectedTask.CLI} onChange={handleChange} className="tc-text-input" />
              <Input label="Nom de Client" name="NOMCLI" value={selectedTask.NOMCLI} onChange={handleChange} className="tc-text-input" />
              <Select label="Catégorie" name="CATCLI" value={selectedTask.CATCLI} onChange={(value) => handleChange({ name: 'CATCLI', value })} className="tc-text-input">
                <Option value="Categorie 1">Categorie 1</Option>
                <Option value="Categorie 2">Categorie 2</Option>
                <Option value="Categorie 3">Categorie 3</Option>
              </Select>
              <Input label="Adresse de Client" name="ADRCLI" value={selectedTask.ADRCLI} onChange={handleChange} className="tc-text-input" />
              <Input label="Nom de Contact" name="NOMCNT" value={selectedTask.NOMCNT} onChange={handleChange} className="tc-text-input" />
              <Select label="Fonction de Client" name="FNCCNT" value={selectedTask.FNCCNT} onChange={(value) => handleChange({ name: 'FNCCNT', value })} className="tc-text-input">
                <Option value="P.D.G">P.D.G</Option>
                <Option value="Directeur Commercial">Directeur Commercial</Option>
                <Option value="Directeur Technique">Directeur Technique</Option>
                <Option value="Responsable des achats">Responsable des achats</Option>
                <Option value="Acheteur">Acheteur</Option>
                <Option value="Responsable de stock">Responsable de stock</Option>
                <Option value="Directeur financier et juridique">Directeur financier et juridique</Option>
                <Option value="Responsable Import/Export">Responsable Import/Export</Option>
                <Option value="Directeur de site">Directeur de site</Option>
                <Option value="Intervenant de site">Intervenant de site</Option>
              </Select>
              <Input label="Téléphone" name="TELCNT" value={selectedTask.TELCNT} onChange={handleChange} className="tc-text-input" />
              <Input label="Objet de la Tâche" name="TSKOBJ" value={selectedTask.TSKOBJ} onChange={handleChange} className="tc-text-input" />
              <Textarea label="Compte Rendu" name="TSKCMR" value={selectedTask.TSKCMR} onChange={handleChange} className="tc-text-input" />
              <Select label="Statut" name="TSKSTA" value={selectedTask.TSKSTA} onChange={(value) => handleChange({ name: 'TSKSTA', value })} className="tc-text-input">
                <Option value="Réalisé">Réalisé</Option>
                <Option value="À faire">À faire</Option>
              </Select>
            </form>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="blue" onClick={handleSaveChanges}>Save</Button>
          <Button variant="text" onClick={() => setOpenEditDialog(false)}>Cancel</Button>
        </DialogFooter>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Supprimer la tâche</DialogHeader>
        <DialogBody divider>
          {selectedTask && (
            <Typography>voulez-vous vraiment supprimer la tâche: {selectedTask.TSKOBJ}?</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="red" onClick={deleteTask}>
            Supprimer
          </Button>
          <Button variant="text" onClick={() => setOpenDeleteDialog(false)}>
            Annuler
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Home;
