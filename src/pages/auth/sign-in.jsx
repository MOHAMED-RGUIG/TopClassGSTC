import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from 'axios'; // Import axios for API calls

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // To handle redirection

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://toptachesapi3.onrender.com/auth/login', {
        USR: username,
        MotDePasse: password,
      });
      
      if (response.data.success) {
        const user = {
          USR: response.data.data.USR,
          EMAILUSR: response.data.data.EMAILUSR,
          ID: response.data.data.ID,
          NOMUSR: response.data.data.NOMUSR,
          TELEP: response.data.data.TELEP
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("loggedInUser", response.data.data.USR);
        const userParams = encodeURIComponent(JSON.stringify(user));
        
       // window.location.href = `https://topclass1.vercel.app/?user=${userParams}`;
        // Redirect to dashboard
        navigate('/dashboard/ACCUEIL');
      }
    } catch (error) {
      setErrorMessage('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };


  return (
    <section className="m-8 font-poppins flex gap-4">
      <div className="w-full lg:w-3/5" style={{ marginTop: '50px' }}>
        <div className="text-center">
          <img 
            src="/img/Logo-Lavazza.jpg" 
            alt="Sign In" 
            className="mx-auto mb-4" 
            style={{ maxWidth: '100%', height: '250px' }} 
          />
          <Typography 
            variant="h3" 
            color="blue-gray" 
            className="text-4xl font-poppins font-bold mb-4">
            Bienvenu chez nous!
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleLogin}>
          <div className="mb-1 font-poppins flex flex-col gap-6">
            {/* <Typography variant="small" color="blue-gray" className="-mb-3 font-poppins border-none">
              Nom d'utilisateur
            </Typography> */}
            <Input
              size="lg"
              placeholder="NOM D'UTILISATEUR"
style={{ backgroundColor: '#eef3ff',    border: 'none',
    borderRadius: '25px',
    color: '#000 !important',
    fontFamily: 'poppins',
    fontSize: '14px',
    fontWeight: '600',
    height: '60px',
    marginBottom: '30px',
    padding: '15px 25px'}}
              className="rounded-lg font-poppins mb-5 p-[15px] px-[25px] font-semibold text-[14px] bg-custom-blue rounded-[50px] h-[60px] border-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
           { /*<Typography variant="small" color="blue-gray" className="-mb-3 font-poppins border-none">
              Mot de passe
            </Typography> */} 
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
style={{ backgroundColor: '#eef3ff',   border: 'none',
    borderRadius: '25px',
    color: '#000 !important',
    fontFamily: 'poppins',
    fontSize: '14px',
    fontWeight: '600',
    height: '60px',
    marginBottom: '30px',
    padding: '15px 25px'}}
                placeholder="MOT DE PASS"
                className="rounded-lg p-[15px] px-[25px] font-semibold text-[14px] bg-custom-blue rounded-[50px] h-[60px] font-poppins border-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 mt-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 mt-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>
          {errorMessage && (
            <Typography variant="small" color="red" className="mb-4">
              {errorMessage}
            </Typography>
          )}
          <Button type="submit" className="mt-6 font-poppins bg-[#1b6cfc] text-white rounded-[50px] h-[60px]" fullWidth>
            Se connecter
          </Button>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="w-full object-cover rounded-3xl"
          style={{ height: '570px' }}  // Set custom height in pixels
        />
      </div>
    </section>
  );
}

export default SignIn;
