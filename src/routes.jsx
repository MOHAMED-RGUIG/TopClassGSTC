import {
  HomeIcon,
  PencilSquareIcon,
  ShoppingCartIcon,
  ListBulletIcon,
  CogIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, AddTask, CreateAccount, PageOnHold, PageOnHoldOrder, PageOnHoldPanier } from "@/pages/dashboard";

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        name: "Accueil", // Task list
        path: "/ACCUEIL",
        icon: ({ isActive }) => (
          <HomeIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <Home />,
      },
      {
        name: "Ajouter une tâche", // Add task
        path: "/AJOUTER-TACHE",
        icon: ({ isActive }) => (
          <PencilSquareIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <AddTask />,
      },
      {
        name: "Liste des tâches", // Task list
        path: "/LISTE-TACHES",
        icon: ({ isActive }) => (
          <TableCellsIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <Tables />,
      },
      {
        name: "Création du compte", // Create account
        path: "/CREATION-COMPTE",
        icon: ({ isActive }) => (
          <UserCircleIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <CreateAccount />,
      },
      {
        name: "Ajouter une commande", // Add order
        path: "/AJOUTER-COMMANDE",
        icon: ({ isActive }) => (
          <ShoppingCartIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <PageOnHold />,
      },
      {
        name: "Panier", // List orders
        path: "/PANIER-COMMANDES",
        icon: ({ isActive }) => (
          <HeartIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <PageOnHoldPanier />,
      },
      {
        name: "Liste des commandes", // List orders
        path: "/LISTE-COMMANDES",
        icon: ({ isActive }) => (
          <ListBulletIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <PageOnHoldOrder />,
      },
      {
        name: "Notification", // Task list
        path: "/NOTIFICATION",
        icon: ({ isActive }) => (
          <BellIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <Notifications />,
      },
      {
        name: "Paramètres", // Settings
        path: "/PARAMETRES",
        icon: ({ isActive }) => (
          <CogIcon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#183f7f]"}`} />
        ),
        element: <Profile />,
      },
    ],
  },
];

export default routes;
