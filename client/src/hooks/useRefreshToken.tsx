import axios from "../api/axios";
import { AuthContextType } from "../contexts/AuthContext";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth() as AuthContextType;

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth((prev: any) => {
      return { ...prev, accessToken: response.data.accessToken };
    });
  };

  return refresh;
};

export default useRefreshToken;
