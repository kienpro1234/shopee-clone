import { useRoutes } from "react-router-dom";

import ProductList from "./pages/ProductList/ProductList";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RegisterLayout from "./layouts/RegisterLayout/RegisterLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";

function App() {
  const router = useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      ),
    },

    {
      path: "/register",
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      ),
    },
  ]);

  return <>{router}</>;
}

export default App;
