import { redirect } from "react-router";

export const authMiddleware = async (
  { request }: { request: Request },
  next: () => Promise<unknown>
) => {
  const url = new URL(request.url);
  console.log(`[Auth] 檢查路由: ${url.pathname}`);

  // 檢查 localStorage 中是否有 token
  const token = localStorage.getItem("token");

  if (!token) {
    console.log(`[Auth] 未登入，重定向到 /login`);
    throw redirect("/login");
  }

  console.log(`[Auth] 已登入，允許訪問`);
  await next();
};
