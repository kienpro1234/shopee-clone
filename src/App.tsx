import { Navigate, Outlet, useRoutes } from "react-router-dom";

import ProductList from "./pages/ProductList/ProductList";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RegisterLayout from "./layouts/RegisterLayout/RegisterLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Profile from "./pages/Profile/Profile";
import { useContext } from "react";
import { AppContext } from "./context/app.context";
import { path } from "./consts/const";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  if (!isAuthenticated) {
    alert("Bạn cần đăng nhập để truy cập trang này.");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/"} />;
}

function App() {
  const router = useRoutes([
    { path: "/", element: <ProtectedRoute />, children: [{ path: "/profile", element: <Profile /> }] },
    {
      path: "/",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          ),
        },

        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          ),
        },
      ],
    },
    {
      path: "/",
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      ),
    },
  ]);

  return <>{router}</>;
}

export default App;
