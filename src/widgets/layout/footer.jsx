import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "TopClass Expresso",
  brandLink: "https://topclass.ma/",
  routes: [
    { name: "TopClass Expresso", path: "https://topclass.ma/" },
    { name: "About Us", path: "https://topclass.ma/content/6-notre-histoire" },
  ],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
