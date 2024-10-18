import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-56 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <IconButton
          variant="text"
          color="blue-gray"
          size="sm"
          ripple={false}
          className="absolute left-0 top-0 grid xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <ArrowLeftIcon strokeWidth={2.5} className="h-5 w-5 text-blue-gray-500" />
        </IconButton>

        <Link to="https://topclass.ma/" className="py-6 px-8 text-center mt-6">
          <img
            src={brandImg}
            alt="Brand Logo"
            className="mx-auto h-12 w-auto"
            style={{ width: "100px", height: "auto" }}
          />
        </Link>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon: Icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                      className="flex items-center gap-1.5 px-2 py-2 text-xs capitalize tc-button rounded-full"
                      fullWidth
                    >
                      {/* Render the icon component and pass isActive */}
                      <Icon isActive={isActive} />
                      <Typography
                        color="inherit"
                        className={`font-medium capitalize text-xs tc-label-sidenav ${
                          isActive ? "tc-label-sidenav-active" : ""
                        }`}
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo_footer.png",
  brandName: "TopClass",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
