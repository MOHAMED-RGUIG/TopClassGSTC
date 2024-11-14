import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios"; // Import axios for HTTP requests

export function AddTask() {
  const [TSKTYP, setTSKTYP] = useState("");
  const [TSKACT, setTSKACT] = useState("");
  const [DATDEB, setDATDEB] = useState("");
  const [HURDEB, setHURDEB] = useState("");
  const [HURFIN, setHURFIN] = useState("");
  const [CLI, setCLI] = useState("");
  const [NOMCLI, setNOMCLI] = useState("");
  const [CATCLI, setCATCLI] = useState("");
  const [ADRCLI, setADRCLI] = useState("");
  const [NOMCNT, setNOMCNT] = useState("");
  const [FNCCNT, setFNCCNT] = useState("");
  const [TELCNT, setTELCNT] = useState("");
  const [TSKOBJ, setTSKOBJ] = useState("");
  const [TSKCMR, setTSKCMR] = useState("");
  const [TSKSTA, setTSKSTA] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data to be sent to the backend
    const newTask = {
      TSKTYP,
      TSKACT,
      DATDEB,
      HURDEB,
      HURFIN,
      CLI,
      NOMCLI,
      CATCLI,
      ADRCLI,
      NOMCNT,
      FNCCNT,
      TELCNT,
      TSKOBJ,
      TSKCMR,
      TSKSTA,
    };

    try {
      // Send data to the backend using a POST request
      const response = await axios.post("https://toptachesapi3.onrender.com/addtask/tasks", newTask, {
        headers: {
          usr: localStorage.getItem("loggedInUser"), // Assuming user is stored in localStorage
        },
      });

      // Handle the response from the server
      if (response.data.success) {
        setSuccessMessage("La tâche ajoutée avec succès");
        setShowSuccess(true);
        let counter = 0;
        const interval = setInterval(() => {
          counter += 10;
          setProgress(counter);
          if (counter === 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowSuccess(false);
              setProgress(0);
            }, 500); // hide after half a second delay for smooth transition
          }
        }, 500); // update every half second to fill in 5 seconds total
      }
      // Reset the form after submission
      setTSKTYP("");
      setTSKACT("");
      setDATDEB("");
      setHURDEB("");
      setHURFIN("");
      setCLI("");
      setNOMCLI("");
      setCATCLI("");
      setADRCLI("");
      setNOMCNT("");
      setFNCCNT("");
      setTELCNT("");
      setTSKOBJ("");
      setTSKCMR("");
      setTSKSTA("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="mt-12">
    <div id="heading-tit"><h2>Ajouter une tache</h2></div>
  
    <div className="flex justify-center items-center mb-6">
      <Card className="w-full max-w-lg transform transition">
        <CardBody className="flex justify-center bg-white p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="ajoutertache flex flex-col gap-4">

              {/* Type de tâche */}
              <div>
                <Select value={TSKTYP} label="Type de tache" onChange={(e) => setTSKTYP(e)} className="tc-text-input ">
                  <Option value="Réunion Commercial">Réunion Commercial</Option>
                  <Option value="Visite Client">Visite Client</Option>
                  <Option value="Prospection">Prospection</Option>
                  <Option value="Recouvrement">Recouvrement</Option>
                  <Option value="Formation">Formation</Option>
                  <Option value="Séminaire">Séminaire</Option>
                  <Option value="Salon">Salon</Option>
                  <Option value="Règlement de litiges">Règlement de litiges</Option>
                </Select>
              </div>

              {/* Action de la tâche */}
              <div>
                <Select value={TSKACT} label="Action de la tâche" onChange={(e) => setTSKACT(e)} className="tc-text-input">
                  <Option value="Action 1">Action 1</Option>
                  <Option value="Action 2">Action 2</Option>
                  <Option value="Action 3">Action 3</Option>
                </Select>
              </div>

              {/* Date de début */}
              <div>
                <Input
                  label="Date de début"
                  type="date"
                  value={DATDEB}
                  onChange={(e) => setDATDEB(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Heure de début */}
              <div>
                <Input
                label="Heure de début"
                  type="time"
                  value={HURDEB}
                  onChange={(e) => setHURDEB(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Heure de fin */}
              <div>
                <Input
                    label="Heure de fin"
                  type="time"
                  value={HURFIN}
                  onChange={(e) => setHURFIN(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Code Client */}
              <div>
                <Input
                label="Code Client"
                  type="text"
                  value={CLI}
                  onChange={(e) => setCLI(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Nom de client */}
              <div>
                <Input
                 label="Nom de Client"
                  type="text"
                  value={NOMCLI}
                  onChange={(e) => setNOMCLI(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Catégorie */}
              <div>
                <Select value={CATCLI}  label="Catégorie" onChange={(e) => setCATCLI(e)} className="tc-text-input">
                  <Option value="Categorie 1">Categorie 1</Option>
                  <Option value="Categorie 2">Categorie 2</Option>
                  <Option value="Categorie 3">Categorie 3</Option>
                </Select>
              </div>

              {/* Adresse du client */}
              <div>
                <Input
                label="Adresse de client"
                  type="text"
                  value={ADRCLI}
                  onChange={(e) => setADRCLI(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Nom de contact */}
              <div>
                <Input
                label="Nom de contact"
                  type="text"
                  value={NOMCNT}
                  onChange={(e) => setNOMCNT(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Fonction du client */}
              <div>
                <Select value={FNCCNT} label="Fonction du client" onChange={(e) => setFNCCNT(e)} className="tc-text-input">
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
              </div>

              {/* Téléphone */}
              <div>
                <Input
                label="Téléphone"
                  type="text"
                  value={TELCNT}
                  onChange={(e) => setTELCNT(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Objet de la tâche */}
              <div>
                <Input
                  label="Objet de la tâche"
                  type="text"
                  value={TSKOBJ}
                  onChange={(e) => setTSKOBJ(e.target.value)}
                  className="tc-text-input"
                />
              </div>

              {/* Compte rendu */}
              <div>
                <textarea
                    label="Compte rendu"
                  value={TSKCMR}
                  onChange={(e) => setTSKCMR(e.target.value)}
                  className="tc-text-input tc-text-textarea"
                 
                 
                />
              </div>

              {/* Statut */}
              <div>
                <Select value={TSKSTA}     label="Statut" onChange={(e) => setTSKSTA(e)} className="tc-text-input">
                  <Option value="Réalisé">Réalisé</Option>
                  <Option value="À faire">À faire</Option>
                </Select>
              </div>

              <Button type="submit" className="mt-4 rounded-full bg-[#183f7f] text-white tc-button" fullWidth>
                Ajouter la tâche
              </Button>
              {showSuccess && (
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                      <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-width duration-500"></div>
                    </div>
                    <Typography color="blue" className="text-center">{successMessage}</Typography>
                  </div>
                </div>
              )}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
export default AddTask;
