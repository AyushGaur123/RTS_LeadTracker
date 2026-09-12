import api from "./api";

const login = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};



const register = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

const authService = {
  login,
  register,
  getMe,
};

export default authService;