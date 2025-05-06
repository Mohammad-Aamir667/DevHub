import { toast } from "react-toastify";

export const handleAxiosError = (
  error,
  customMessages = {},
  ignoreStatuses = [],
  toastId = "axios-error" 
) => {
  const {
    network = "Network error. Please check your internet connection.",
    server = "Server error. Please try again later.",
    unauthorized = "You are not authorized. Please login again.",
    forbidden = "Access denied.",
    notFound = "Resource not found.",
    defaultMsg = "Something went wrong.",
  } = customMessages;
  if (toastId && toast.isActive(toastId)) return;

  if (!error?.response) {
    if (!ignoreStatuses.includes("network"))  toast.error(network, { toastId });
    return;
  }

  const status = error.response.status;

  if (ignoreStatuses.includes(status)) return; 

  switch (status) {
    case 400:
      toast.error(error.response.data.message || defaultMsg,{ toastId });
      break;
    case 401:
      toast.error(unauthorized,{ toastId });
      break;
    case 403:
      toast.error(forbidden,{ toastId });
      break;
    case 404:
      toast.error(notFound,{ toastId });
      break;
    case 500:
      toast.error(server,{ toastId });
      break;
    default:
      toast.error(error.response.data.message || defaultMsg,{ toastId });
  }
};
