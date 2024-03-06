import { useNavigate } from "react-router";
import axios from "../../api/axios";
import useHandleError from "../useHandleError";

const useUserService = () => {
  const handleError = useHandleError();
  const navigate = useNavigate();

  const register = async (email: string, password: string) => {
    try {
      const response = await axios({
        url: "/auth/login",
        method: "post",
        data: { email, password },
      });
      if (response?.status === 201) navigate("/login");
    } catch (err) {
      handleError(err);
    }
  };
  return { register };
};

export default useUserService;
