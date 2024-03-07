import { useLocation, useNavigate } from "react-router";
import axios from "../../api/axios";
import { LoginInfo } from "../../components/Login";
import useAuth from "../useAuth";
import useHandleError from "../useHandleError";
import { ROUTE_PREFIX } from "../../constants";

const useAuthService = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleError = useHandleError();
  const from = location?.state?.from?.pathname || `${ROUTE_PREFIX}/main`;

  const login = async (loginInfo: LoginInfo) => {
    try {
      const response = await axios({
        url: "/auth/login",
        method: "post",
        data: loginInfo,
      });
      if (response?.status === 200) {
        setAuth(response.data);
        navigate(from, { replace: true });
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { login };
};

export default useAuthService;
