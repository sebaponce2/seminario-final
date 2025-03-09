import { EXCHANGE_IN_PROGRESS, PENDING_APPROVAL, REJECTED } from "./enums";

export const labels = {
  APPROVED: "Disponible",
  REJECTED: "No aprobado",
  WAITING_FOR_APPROVAL: "En proceso de validación",
  EXCHANGE_COMPLETED: "Intercambiado",
  EXCHANGE_IN_PROGRESS: "Intercambio en progreso",
};

export const classStatus = {
  APPROVED: "bg-green-100 text-green-800",
  EXCHANGE_COMPLETED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  WAITING_FOR_APPROVAL: "bg-yellow-100 text-yellow-800",
  EXCHANGE_IN_PROGRESS: "bg-yellow-100 text-yellow-800",
};

export const statusOptions = [
  {
    text: "Pendiente",
    status: PENDING_APPROVAL,
  },
  {
    text: "Confirmado",
    status: EXCHANGE_IN_PROGRESS,
  },
  {
    text: "Rechazado",
    status: REJECTED,
  },
]