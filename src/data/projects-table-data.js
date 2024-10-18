import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"; // Assuming you're using Heroicons for the icons

export const projectsTableData = [
  {
    taskObject: "Develop New API",
    client: "Client A",
    startDate: "2024-01-01",
    endDate: "2024-01-10",
    time: "08:00 - 17:00",
    status: "Réalisée", // 'Realiser' = completed, 'A Faire' = to-do
    action: ["view", "edit", "delete"], // Just key names for actions
  },
  {
    taskObject: "Fix Security Issues",
    client: "Client B",
    startDate: "2024-02-05",
    endDate: "2024-02-15",
    time: "09:00 - 18:00",
    status: "À faire",
    action: ["view", "edit", "delete"],
  },
  {
    taskObject: "Website Redesign",
    client: "Client C",
    startDate: "2024-03-10",
    endDate: "2024-03-20",
    time: "10:00 - 19:00",
    status: "Réalisée",
    action: ["view", "edit", "delete"],
  },
  {
    taskObject: "Mobile App Development",
    client: "Client D",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    time: "09:00 - 17:00",
    status: "À faire",
    action: ["view", "edit", "delete"],
  },
  {
    taskObject: "Setup Cloud Infrastructure",
    client: "Client E",
    startDate: "2024-05-05",
    endDate: "2024-05-15",
    time: "08:30 - 17:30",
    status: "Réalisée",
    action: ["view", "edit", "delete"],
  },
  {
    taskObject: "SEO Optimization",
    client: "Client F",
    startDate: "2024-06-01",
    endDate: "2024-06-10",
    time: "09:00 - 18:00",
    status: "À faire",
    action: ["view", "edit", "delete"],
  },
];

export default projectsTableData;
