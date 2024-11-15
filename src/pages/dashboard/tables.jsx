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
import { EyeIcon, PencilIcon, TrashIcon,CheckCircleIcon, ClipboardIcon ,UserIcon, CalendarIcon, ClockIcon,CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import axios from "axios";
import Chart from "react-apexcharts";
import Vatar from "@/pages/dashboard/vatar";
import { FaFilter } from "react-icons/fa";
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
{/* FILTRE */}
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    TSKOBJ: false,
    NOMCLI: false,
    HURDEB: false,
    HURFIN: false,
    DATDEB: false,
  });
 const fieldMapping = {
    TSKOBJ: "Titre de la tâche",
    NOMCLI: "Nom du client",
    HURDEB: "Heure du début",
    HURFIN: "Heure de fin",
    DATDEB: "Date de la tâche",
  };
  // Toggle Filter Popup
  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle Field Selection
  const handleFieldChange = (field) => {
    setSelectedFields((prevFields) => ({
      ...prevFields,
      [field]: !prevFields[field],
    }));
  };
  const filteredTasks = tasks
  .filter((task) => {
    // Default to show all tasks if 'all' is selected or no specific filter is applied
    if (filter === "realise") return task.TSKSTA === "Réalisé";
    if (filter === "aFaire") return task.TSKSTA === "À faire";
    return true; // 'all' or default shows all tasks
  })
  .filter((task) => {
    // Only apply search if there’s a search term or selected fields
    if (!searchTerm || !Object.values(selectedFields).some((isSelected) => isSelected)) {
      return true; // No search term or fields selected: show all tasks based on status filter only
    }
    // Apply field-based filtering if any field is selected and search term is present
    return Object.keys(selectedFields).some(
      (field) =>
        selectedFields[field] &&
        task[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  {/* FILTRE */}
  // Filtrer les tâches selon le statut
 /* const filteredTasks = tasks.filter((task) => {
    if (filter === "realise") return task.TSKSTA === "Réalisé";
    if (filter === "aFaire") return task.TSKSTA === "À faire";
    return true; // 'all' affiche toutes les tâches
  });*/
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

  // Open dialog handlers
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
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };
  
  const formatTime = (timeString) => {
    if (!timeString) {
      console.log("formatTime called with undefined or null");
      return '';
    }
  
    try {
      const timeParts = timeString.split(':'); // Assuming time is in "HH:mm:ss" or "HH:mm" format
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
  
      const date = new Date();
      date.setUTCHours(hours, minutes, 0); // Set time in UTC (GMT)
  
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24-hour format
        timeZone: 'GMT' // Force GMT timezone
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return ''; 
    }
  };
  
  

  const handleSaveChanges = async () => {
    if (!selectedTask) {
      console.log("No task selected for update.");
      return;
    }
  
    try {
      console.log("Sending data to backend:", selectedTask);
      const response = await axios.put(`https://toptachesapi3.onrender.com/tasks/updatetask/${selectedTask.TSKNUM}`, selectedTask, {
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
      const response = await axios.delete(`https://toptachesapi3.onrender.com/tasks/${selectedTask.TSKNUM}`);
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
          className="h-4 w-4 cursor-pointer text-black"
          onClick={() => {
            console.log("Opening dialog for task:", task);
            handleOpenViewDialog(task);
          }}
        />
        <PencilIcon
          className="h-4 w-4 cursor-pointer text-blue-900"
          onClick={() => handleOpenEditDialog(task)}
        />
        <TrashIcon
          className="h-4 w-4 cursor-pointer text-red-800"
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
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-[#183f7f] text-white" : "bg-gray-500 text-white"
          }`}
        >
          Tous
        </button>
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
       
      </div>

   

{/* FILTRE */}
      <div className="mb-1 grid grid-cols-1 xl:grid-cols-1 bg-[#ECEFF100]">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="p-2 w-full outline-none focus:ring-0"
        />
         <button
          onClick={toggleFilterPopup}  style={{
            margin: "17px 5px" }}
          className="p-2 bg-[#183f7f] text-white rounded-md"
        >
             <FaFilter className="text-lg pt-1" /> {/* Font Awesome filter icon */}
        </button>
      </div>

      {/* Filter Popup */}
         {isFilterOpen && ( 
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 shadow-lg w-11/12 md:w-1/2" style={{ borderRadius: "0" }}>
      <h3 className="text-lg font-bold mb-4 text-center">SELECTIONNER LES CHAMPS POUR FILTRER</h3>
      <div className="grid grid-cols-2 gap-4" style={{ margin: "0 auto", marginLeft: "40px" }}>
        {Object.keys(selectedFields).map((field) => (
          <label key={field} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFields[field]}
              onChange={() => handleFieldChange(field)}
            />
            <span style={{ boxShadow: "none", color: "#000", fontSize: "12px" }}>
              {fieldMapping[field] || field}
            </span>
          </label>
        ))}
      </div>
      <div
        className="flex justify-between mt-6 w-1/2"
        style={{
          margin: "0 auto",
        }}
      >
      {/* Button avec l'icône valider */}
      <button
        onClick={toggleFilterPopup}
        className="p-3 bg-[#183f7f] text-white rounded-full mt-2 flex items-center justify-center"
        style={{
          margin: "17px 5px", }}>
        <CheckIcon className="h-5 w-5 text-white" /> {/* Icône Heroicons Outline */}
      </button>

      {/* Button avec l'icône fermer */}
      <button
        onClick={toggleFilterPopup}
        className="p-3 bg-[#183f7f] text-white rounded-full flex items-center justify-center"
        style={{
          marginLeft: "3px",
          margin: "17px auto",}}
      >
        <XMarkIcon className="h-5 w-5 text-white" style={{
          fontSize: "8px"
        }}/> {/* Icône Heroicons Outline */}
      </button>
    </div>
    </div>
  </div>
)}
      {/* Task List */}
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1 bg-[#ECEFF100]">
  <Card className="overflow-hidden xl:col-span-2 shadow-sm bg-[#ECEFF100]">
    <CardBody className="px-0 py-4 bg-[#ECEFF100]">
      {filteredTasks.map((task, index) => (
        <div
          key={index}
          className="flex flex-col justify-between px-6 py-4 bg-white shadow-lg rounded-lg mt-4 border-l-4 border-blue-900"
        >
          {/* Row for title */}
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-[#183f7f]">
              {task.TSKOBJ}
            </span>
            <div className="flex flex-col items-end gap-2">
              {/* Actions */}
              <div className="flex gap-4 text-black-500">
                {renderActionIcons(task)}
              </div>
              {/* Button "Réalisé/À Faire" */}
           
            </div>
          </div>

          {/* Row for client name */}
          <div className="">
  <span className="flex text-black text-[12px] gap-2 mt-1 mb-1 ">
    <UserIcon className="w-4 h-4 mr-2 text-[#183f7f]" /> {/* Icône utilisateur */}
    {task.NOMCLI}
  </span>
</div>
          <div className="flex items-center gap-2">
    
    <span className="flex text-black text-[11px] gap-2 ">
    <CalendarIcon className="w-4 h-4 mr-2 text-[#183f7f]" /> 
      {formatDate(task.DATDEB)}</span>
  </div>
          {/* Row for time range */}
          
          {/* Row for date */}
          <div className="flex items-center justify-between">
  {/* Date section */}

  <div className="flex items-center gap-2 text-[#183f7f] text-[11px]">
  <ClockIcon className="w-4 h-4 mr-2 text-[#183f7f]" /> 
            <span>De {formatTime(task.HURDEB)} à {formatTime(task.HURFIN)}</span>
          </div>

  {/* Button aligned to the right */}
  <button
  className={`text-white text-[12px] px-4 py-1 rounded-2xl ${
    task.TSKSTA === 'Réalisé' ? 'bg-[#007f66]' : 'bg-[#183f7f]'
  }`}
>
  {task.TSKSTA === 'Réalisé' ? 'Réalisé' : 'À Faire'}
</button>
</div>
        </div>
      ))}
    </CardBody>
  </Card>
</div></div>
 {/* FILTRE */}



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
