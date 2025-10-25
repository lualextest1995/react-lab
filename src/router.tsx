import { createBrowserRouter } from "react-router";
import { loggingMiddleware } from "./middleware/logging";
import { authMiddleware } from "./middleware/auth";
import App from "./App";
import Home, { loader as homeLoader } from "./pages/Home";
import Test1, { loader as test1Loader } from "./pages/Test1";
import Test2, { loader as test2Loader } from "./pages/Test2";
import Test3, { loader as test3Loader } from "./pages/Test3";
import Login from "./pages/Login";
import ProtectedLayout from "./layouts/ProtectedLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    middleware: [loggingMiddleware],
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        // ProtectedLayout - 保護測試頁面
        Component: ProtectedLayout,
        middleware: [authMiddleware], // 認證 middleware
        children: [
          {
            path: "test1",
            loader: test1Loader,
            Component: Test1,
          },
          {
            path: "test2",
            loader: test2Loader,
            Component: Test2,
          },
          {
            path: "test3",
            loader: test3Loader,
            Component: Test3,
          },
        ],
      },
    ],
  },
]);
