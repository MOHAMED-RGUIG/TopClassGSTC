import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import React from 'react';


export function StatisticsCard({ color, icon, title, value, footer }) {
  return (
    <Card className="border border-blue-gray-100 shadow-sm rounded-none"> {/* No border radius */}
      <CardHeader
        variant="gradient"
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center rounded-[50px]"
        style={{ backgroundColor: '#183f7f' }} // Applying background color
      >
        {/* Make the icon white and bold */}
        {React.cloneElement(icon, { className: 'text-white font-bold h-6 w-6' })}
      </CardHeader>

      <CardBody className="p-4 text-right rounded-none"> {/* No border radius */}
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="leading-normal-value">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4 rounded-none"> {/* No border radius */}
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
