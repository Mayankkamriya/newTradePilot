import axios from "axios";
import { toast } from "react-toastify";

export const getProjects = async () => {
  try {
    const response = await axios.get("/api/projects");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        `API Error: ${error.response?.status} ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
};
