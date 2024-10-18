import React, { useState, useEffect } from "react";

const SecondAppEmbedOrder = () => {
  const [userParams, setUserParams] = useState("");

  useEffect(() => {
    // Retrieve the current user from localStorage
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      const encodedUserParams = encodeURIComponent(loggedInUser);
      setUserParams(encodedUserParams);
    } else {
      // If no user is logged in, you can redirect to the login page or handle the case
      setUserParams(null);  // Or redirect to /login if needed
    }
  }, []);  // Empty dependency array so it runs only once on mount

  // If userParams is null, show an error message or redirect logic here
  if (!userParams) {
    return <div>User not logged in. Please log in to continue.</div>;
  }

  return (
    <iframe
      src={`https://topclass1.vercel.app/orders?user=${userParams}`}
      title="Second App"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  );
};

export default SecondAppEmbedOrder;
