import React from "react"; // Add this import
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: (props) =>
      React.createElement(ChartBarIcon, {
        className: "w-6 h-6 text-blue-800",
        ...props,
      }),
    title: "Toutes les tâches",
    value: "$53k",
  },
  {
    color: "gray",
    icon: (props) =>
      React.createElement(CheckCircleIcon, {
        className: "w-6 h-6 text-green-500",
        ...props,
      }),
    title: "Les tâches réalisées",
    value: "2,300",
  },
  {
    color: "gray",
    icon: (props) =>
      React.createElement(ClipboardIcon, {
        className: "w-6 h-6 text-yellow-500",
        ...props,
      }),
    title: "Les tâches à faire",
    value: "3,462",
  },
];

export default statisticsCardsData;
