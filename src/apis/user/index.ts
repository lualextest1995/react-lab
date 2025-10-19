import instance from "@/utils/request";

interface LoginRequest {
  email: string;
  password: string;
}

export const login = (data: LoginRequest) => {
  return instance.request({
    url: "/users",
    method: "GET",
    params: data,
  });
};
