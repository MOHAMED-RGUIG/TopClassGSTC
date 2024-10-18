import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid"; // Import the icons for password visibility
import { ProfileInfoCard } from "@/widgets/cards";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState(profile);
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const navigate = useNavigate(); // For redirection

  // Fetch user details when component loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      const USR = localStorage.getItem("loggedInUser"); // Retrieve the logged-in user from localStorage
      if (!USR) {
        navigate("/auth/sign-in"); // Redirect to sign-in if no user is found in localStorage
        return;
      }

      try {
        console.log(`Fetching user details from: https://toptachesapi3.onrender.com/user/getUserDetails/${USR}`);
        const response = await axios.get(`https://toptachesapi3.onrender.com/user/getUserDetails/${USR}`);
        if (response.data.success) {
          const userData = response.data.data;
          setProfile({
            firstName: userData.PRNUSR,
            lastName: userData.NOMUSR,
            email: userData.EMAILUSR,
            mobile: userData.TELEP,
            typeuser : userData.TYPUSR,
            password: userData.MotDePasse, // Fetch and store the actual password
          });

          // Update form values for editing
          setFormValues({
            firstName: userData.PRNUSR,
            lastName: userData.NOMUSR,
            email: userData.EMAILUSR,
            mobile: userData.TELEP,
            typeuser : userData.TYPUSR,
            password: "**********", 
          });
        } else {
          navigate("/auth/sign-in"); // Redirect if no user found
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [navigate]); // Only run this effect on component mount

  // Toggle dialog
  const handleOpen = () => setOpenDialog(!openDialog);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    if (showPassword) {
      setFormValues({ ...formValues, password: "**********" });
    } else {
      setFormValues({ ...formValues, password: profile.password });
    }
    setShowPassword(!showPassword);
  };

  // Handle form submission to save changes
  const handleSave = async () => {
    const USR = localStorage.getItem("loggedInUser");
    try {
      const updatedUser = {
        NOMUSR: formValues.lastName,
        PRNUSR: formValues.firstName,
        EMAILUSR: formValues.email,
        TELEP: formValues.mobile,
        MotDePasse: formValues.password === "**********" ? profile.password : formValues.password, // Handle hidden password case
      };

      const response = await axios.put(`https://toptachesapi3.onrender.com/updateuser/updateUser/${USR}`, updatedUser);

      if (response.data.success) {
        setProfile({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          mobile: formValues.mobile,
          password: formValues.password === "**********" ? profile.password : formValues.password,
        });
        handleOpen(); // Close the dialog
        console.log("User updated successfully!");
      } else {
        console.error("Error updating user:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <>
      <div id="heading-tit"><h2>Paramètres</h2></div>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/pattern.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {profile.typeuser}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="settings" onClick={handleOpen}>
                    <PencilIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Modifier
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1">
            <ProfileInfoCard
              title="Profile Information"
              details={{
                Nom: profile.lastName,
                Prenom: profile.firstName,
                Telephone: profile.mobile,
                Email: profile.email,
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Dialog for Updating Information */}
      <Dialog open={openDialog} handler={handleOpen}>
        <DialogHeader>Update Profile Information</DialogHeader>
        <DialogBody divider>
          <form className="flex flex-col gap-4">
            <Input
              label="Prenom"
              size="lg"
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
            />
            <Input
              label="Nom"
              size="lg"
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
            />
            <Input
              label="Email"
              size="lg"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <Input
              label="Telephone"
              size="lg"
              name="mobile"
              value={formValues.mobile}
              onChange={handleInputChange}
            />
            <div className="relative">
              <Input
                label="Mot de passe"
                size="lg"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;
