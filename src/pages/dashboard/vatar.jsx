import React, { useState, useEffect } from "react";

const Avatar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Retrieve the current user from localStorage and parse it into an object
    const storedUser = localStorage.getItem("currentUser");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Convert the string to an object
      setLoggedInUser(parsedUser); // Set it in state
    }
  }, []);  // Empty dependency array so it runs only once on mount

  if (!loggedInUser) {
    return <p>Loading user data...</p>; // Show a loading message if the user data is not yet available
  }

  return (
    <div className="flex justify-center items-center border-none mt-4 p-0">
    <div className=" mb-5 border border-blue-gray-100 shadow-sm rounded-none bg-[#183f7f] text-[#ffff] w-full">
      <div className="flex flex-col space-y-2 p-4">
      <div  className="bg-[#183f7f] text-[#ffff]" style={{color:'#fffff',border:'none'}}><h2 className="font-bold">Bienvenue</h2></div>

        {/* Première ligne : Image à gauche, Nom à droite */}
        <div className="flex items-center place-items-center">
          <img src="/img/team-2.jpg" alt="Avatar" className="w-16 h-16 rounded-full" />
          <div className="ml-4 flex-grow text-left pt-1">
            <h1 className="text-lg font-bold">{loggedInUser.NOMUSR}</h1>
          </div>
        </div>
  
        {/* Deuxième ligne : Immatriculation et Téléphone à droite */}
      
      </div>
  
      <div className="flex flex-col mb-5 pb-5">
  {/* Première ligne : N°immatriculation à gauche, N°Tel à droite */}
  <div className="flex justify-between w-1/2 p-2 gap-x-5">
    <h3 className="" style={{paddingLeft:'20px'}}>N°immatriculation</h3>
    <h3 className="text-left" style={{paddingRight:'5px'}}>N°Téléphone</h3>
  </div>

  {/* Deuxième ligne : ID et Téléphone */}
  <div className="flex justify-between w-1/2 mt-2 p-2 gap-x-5">
    <h3 className="" style={{paddingLeft:'20px'}}>{loggedInUser.ID}</h3>
    <h3 className="" >{loggedInUser.TELEP}</h3>
  </div>
</div>


    </div>
    
  </div>
  
  );
};

export default Avatar;
