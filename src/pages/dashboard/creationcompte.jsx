import React, { useState } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import { AiOutlinePlus } from "react-icons/ai";

export function CreateAccount() {
  const [formData, setFormData] = useState({
    typeDeCreation: '',
    codeClient: '',
    date: '',
    groupePart: '',
    nomDeGroupe: '',
    autreCompte: '',
    nomDeClient: '',
    chargeDuCompte: '',
    nomEtRaison: '',
    activite: '',
    gerant: '',
    telephoneFixe: '',
    fax: '',
    email: '',
    siege: '',
    ville: '',
    formeJuridique: '',
    adresseLivraison: '',
    identifiantFiscal: '',
    nRC: '',
    nPatente: '',
    ice: '',
    banquePrincipale: '',
    agenceVille: '',
    numDeCompte: '',
    ripBancaire: '',
    typeDeContrat: '',
    zone: '',
    canal: '',
    customText: '',
  });
  const [contacts, setContacts] = useState([{ name: '', function: '', phone: '', email: '' }]);
  const [machines, setMachines] = useState([{ ref: '', qte: '', etat: '' }]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    setContacts(prev => [...prev, { name: '', function: '', phone: '', email: '' }]);
  };

  const handleContactChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContacts = contacts.map((contact, i) => {
      if (i === index) {
        return { ...contact, [name]: value };
      }
      return contact;
    });
    setContacts(updatedContacts);
  };

  const handleAddMachine = () => {
    setMachines(prev => [...prev, { ref: '', qte: '', etat: '' }]);
  };

  const handleMachineChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMachines = machines.map((machine, i) => {
      if (i === index) {
        return { ...machine, [name]: value };
      }
      return machine;
    });
    setMachines(updatedMachines);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSuccess(false);
    setProgress(0);
    setSuccessMessage("");
    const clientInfo = {
      companyName: formData.nomEtRaison, // Assuming 'nomEtRaison' is your company name field
      codeclient: formData.codeClient,
      datecreation: formData.date,
      nomdegroupe: formData.nomDeGroupe,
      nomdeclient: formData.nomDeClient,
      chargeducompte: formData.chargeDuCompte,
      activity: formData.activite,
      manager: formData.gerant,
      phone: formData.telephoneFixe,
      fax: formData.fax,
      email: formData.email,
      headquarters: formData.siege,
      city: formData.ville,
      legalForm: formData.formeJuridique,
      deliveryAddress: formData.adresseLivraison,
      taxId: formData.identifiantFiscal,
      rcNumber: formData.nRC,
      patentNumber: formData.nPatente,
      iceNumber: formData.ice,
      mainBank: formData.banquePrincipale,
      bankBranch: formData.agenceVille,
      accountNumber: formData.numDeCompte,
      rip: formData.ripBancaire,
      zone: formData.zone,
      canal: formData.canal,
    };
  
    try {
      const response = await fetch('https://toptachesapi3.onrender.com/api/sendOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientInfo,
          contacts: contacts,
          contacts1: machines, 
          selectedOption: formData.typeDeCreation,
          selectedOption1: formData.groupePart,
          selectedOption2: formData.autreCompte,
          selectedOption4: formData.typeDeContrat,
          customText: formData.customText,
        }),
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
      if (data.success) {
        setSuccessMessage("Email envoyée avec succès!");
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
      else {
        alert('Failed to send email: ' + data.error);
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      alert('Error sending form data');
    }
  };
  

  return (
    <div className="mt-12">
      <div id="heading-tit"><h2>Création du compte</h2></div>
    
      <div className="flex justify-center items-center mb-6">
        <Card className="w-full max-w-lg transform transition">
          <CardBody className="flex justify-center bg-white p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="text"
                label="Type de Création"
                name="typeDeCreation"
                value={formData.typeDeCreation}
                onChange={handleInputChange}
                list="creation-options"
                className="tc-text-input"
              />
              <datalist id="creation-options">
                <option value="Création" />
                <option value="Réactivation" />
                <option value="Modification" />
              </datalist>

              <Input
                type="text"
                label="Code Client"
                name="codeClient"
                value={formData.codeClient}
                onChange={handleInputChange}
                className="tc-text-input"
              />

              <Input
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="tc-text-input"
              />

              <select
                name="groupePart"
                value={formData.groupePart}
                onChange={handleInputChange}
                className="tc-text-input"
              >
                <option value="">Le client est-il groupé?</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>

              {formData.groupePart === 'Oui' && (
                <Input
                  type="text"
                  label="Nom de Groupe"
                  name="nomDeGroupe"
                  value={formData.nomDeGroupe}
                  onChange={handleInputChange}
                  className="tc-text-input"
                />
              )}

              <select
                name="autreCompte"
                value={formData.autreCompte}
                onChange={handleInputChange}
                className="tc-text-input"
              >
                <option value="">Client sous autre compte?</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>

              {formData.autreCompte === 'Oui' && (
                <Input
                  type="text"
                  label="Nom de Client"
                  name="nomDeClient"
                  value={formData.nomDeClient}
                  onChange={handleInputChange}
                  className="tc-text-input"
                />
              )}
              <Input
                type="text"
                label="Chargé du compte"
                name="chargeDuCompte"
                value={formData.chargeDuCompte}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Nom & Raison sociale"
                name="nomEtRaison"
                value={formData.nomEtRaison}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Activité"
                name="activite"
                value={formData.activite}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Gérant(e) Mr/Mme"
                name="gerant"
                value={formData.gerant}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Téléphone fixe"
                name="telephoneFixe"
                value={formData.telephoneFixe}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Fax"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Siège"
                name="siege"
                value={formData.siege}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Forme juridique"
                name="formeJuridique"
                value={formData.formeJuridique}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Adresse de livraison"
                name="adresseLivraison"
                value={formData.adresseLivraison}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="N° identifiant fiscal"
                name="identifiantFiscal"
                value={formData.identifiantFiscal}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="N° RC"
                name="nRC"
                value={formData.nRC}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="N° Patente"
                name="nPatente"
                value={formData.nPatente}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="ICE"
                name="ice"
                value={formData.ice}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Banque principale"
                name="banquePrincipale"
                value={formData.banquePrincipale}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Agence/ville"
                name="agenceVille"
                value={formData.agenceVille}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="N° de compte"
                name="numDeCompte"
                value={formData.numDeCompte}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="RIP Bancaire"
                name="ripBancaire"
                value={formData.ripBancaire}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <div>
                <Typography variant="h6" color="blue-gray">Contacts</Typography>
                {contacts.map((contact, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Input type="text" label="Nom" name="name" value={contact.name} onChange={(e) => handleContactChange(index, e)} className="tc-text-input"/>
                    <Input type="text" label="Fonction" name="function" value={contact.function} onChange={(e) => handleContactChange(index, e)} className="tc-text-input"/>
                    <Input type="text" label="Téléphone" name="phone" value={contact.phone} onChange={(e) => handleContactChange(index, e)} className="tc-text-input"/>
                    <Input type="email" label="Email" name="email" value={contact.email} onChange={(e) => handleContactChange(index, e)} className="tc-text-input"/>
                  </div>
                ))}
                <Button type="button" onClick={handleAddContact} className="mt-4 rounded-full bg-[#183f7f] text-white"><AiOutlinePlus /></Button>
              </div>
              <Input
                type="text"
                label="Chargé du compte"
                name="chargeDuCompte"
                value={formData.chargeDuCompte}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Type de contrat"
                name="typeDeContrat"
                value={formData.typeDeContrat}
                onChange={handleInputChange}
                className="tc-text-input"
                list="contrat-options"
              />
              <datalist id="contrat-options">
                <option value="Depot" />
                <option value="Location" />
                <option value="Vente" />
              </datalist>

              <Input
                type="text"
                label="Zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <Input
                type="text"
                label="Canal"
                name="canal"
                value={formData.canal}
                onChange={handleInputChange}
                className="tc-text-input"
              />
              <div>
                <Typography variant="h6" color="blue-gray">Machines</Typography>
                {machines.map((machine, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Input type="text" label="Référence" name="ref" value={machine.ref} onChange={(e) => handleMachineChange(index, e)} className="tc-text-input"/>
                    <Input type="number" label="Quantité" name="qte" value={machine.qte} onChange={(e) => handleMachineChange(index, e)} className="tc-text-input"/>
                    <Input type="text" label="État" name="etat" value={machine.etat} onChange={(e) => handleMachineChange(index, e)} className="tc-text-input"/>
                  </div>
                ))}
                <Button type="button" onClick={handleAddMachine} className="mt-4 rounded-full bg-[#183f7f] text-white"><AiOutlinePlus /></Button>
              </div>

              <Input
                type="text"
                label="Remarque"
                name="customText"
                value={formData.customText}
                onChange={handleInputChange}
                className="tc-text-input"
              />

              {/* Additional fields similar to above */}
              {/* Contacts and machines sections similar to above with add and edit functionalities */}

              <Button type="submit" className="mt-4 rounded-full bg-[#183f7f] text-white tc-button">
                Envoyer
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

export default CreateAccount;
