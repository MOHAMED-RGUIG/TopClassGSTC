import { useLocation } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-6 shadow-md shadow-blue-gray-500/5" // Larger padding for the navbar
          : "px-0 py-6"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Left-aligned icon */}
        <div className="flex items-center">
          <IconButton
            variant="text"
            color="blue-gray"
            className="text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" /> {/* Keeping original size */}
          </IconButton>
        </div>

        {/* Centered logo and page title */}
        <div className="flex flex-col items-center justify-center absolute left-1/2 transform -translate-x-1/2 mt-4"> {/* mt-4 for margin-top */}
          <img
            src="/img/logo_footer.png"
            alt="Logo"
            className="h-20 w-auto mb-2" 
          />
        </div>

        {/* Empty div to balance the layout */}
        <div className="flex items-center"></div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
