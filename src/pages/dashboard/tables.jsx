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
} from "@material-tailwind/react";
import { EyeIcon, PencilIcon, TrashIcon,CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import axios from "axios";
import Chart from "react-apexcharts";
import Vatar from "@/pages/dashboard/vatar";
export function Tables() {
  const [tasks, setTasks] = useState([]); // Store tasks fetched from the backend
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Store the selected task
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState("bg-blue-500");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState("all");

  // Filtrer les tâches selon le statut
  const filteredTasks = tasks.filter((task) => {
    if (filter === "realise") return task.TSKSTA === "Réalisé";
    if (filter === "aFaire") return task.TSKSTA === "À faire";
    return true; // 'all' affiche toutes les tâches
  });
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
        const response = await axios.get("http://localhost:3000/tasks/tasksall", {
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

  // Open dialog handlers
  const handleOpenViewDialog = async (task) => {
    try {
      const response = await axios.get(`http://localhost:3000/tasks/taskbynum/${task.TSKNUM}`, {
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
      const response = await axios.get(`http://localhost:3000/tasks/taskbynum/${task.TSKNUM}`, {
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
      console.log("No task selected for update.");
      return;
    }
  
    try {
      console.log("Sending data to backend:", selectedTask);
      const response = await axios.put(`http://localhost:3000/tasks/updatetask/${selectedTask.TSKNUM}`, selectedTask, {
        headers: { usr: localStorage.getItem("loggedInUser") },
      });
  
      if (response.data.success) {
        console.log("Task updated successfully");
        setOpenEditDialog(false);
      } else {
        console.log("Failed to update task: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      console.log("An error occurred while updating the task.");
    }
    fetchTasks();
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
      console.log('Task number is missing, cannot delete.');
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:3000/tasks/${selectedTask.TSKNUM}`);
      if (response.data.success) {
        console.log('Task deleted successfully');
        setOpenDeleteDialog(false);
      } else {
        console.log('Failed to delete the task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      console.log('An error occurred while deleting the task.');
    }
    fetchTasks();
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
    <div className="font-poppins mt-12">
      <div id="heading-tit">
        <h2>Liste des tâches</h2>
      </div>

      {/* Boutons de Filtrage */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setFilter("realise")}
          className={`px-4 py-2 rounded ${
            filter === "realise" ? "bg-[#183f7f] text-white" : "bg-gray-500 text-white"
          }`}
        >
          Réalisé
        </button>
        <button
          onClick={() => setFilter("aFaire")}
          className={`px-4 py-2 rounded ${
            filter === "aFaire" ? "bg-[#183f7f] text-white" : "bg-gray-500 text-white"
          }`}
        >
          À Faire
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-[#183f7f] text-white" : "bg-gray-500 text-white"
          }`}
        >
          Tous
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[250px] table-auto">
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
                {filteredTasks.map((task, key) => {
                  const className = `py-3 px-5 ${
                    key === filteredTasks.length - 1 ? "" : "border-b border-blue-gray-50"
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
              Close
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


      {/* Edit Dialog */}
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
        <DialogHeader>Supprimer tâche</DialogHeader>
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

export default Tables;
