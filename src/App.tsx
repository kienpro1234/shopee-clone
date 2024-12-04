import { Navigate, Outlet, useRoutes } from "react-router-dom";

// import ProductList from "./pages/ProductList/ProductList";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
import RegisterLayout from "./layouts/RegisterLayout/RegisterLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";

import { useContext, useEffect, lazy, Suspense } from "react";
import { AppContext } from "./context/app.context";
import { event, path, pathUser } from "./consts/const";
// import ProductDetail from "./pages/ProductDetail";
// import Cart from "./pages/Cart";
import CartLayout from "./layouts/CartLayout";
import { LocalStorageEventTarget } from "./utils/auth";
// import Profile from "./pages/User/pages/Profile";
// import ChangePassword from "./pages/User/pages/ChangePassword";
// import HistoryPurchase from "./pages/User/pages/HistoryPurchase";
// import User from "./pages/User/pages/User";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login/Login"));
const ProductList = lazy(() => import("./pages/ProductList/ProductList"));
const Register = lazy(() => import("./pages/Register/Register"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/User/pages/Profile"));
const ChangePassword = lazy(() => import("./pages/User/pages/ChangePassword"));
const HistoryPurchase = lazy(() => import("./pages/User/pages/HistoryPurchase"));
const User = lazy(() => import("./pages/User/pages/User"));

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
  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener(event.clearLS, reset);
    return () => {
      LocalStorageEventTarget.removeEventListener(event.clearLS, reset);
    };
  }, [reset]);

  const router = useRoutes([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          ),
        },
        {
          path: pathUser.user,
          element: (
            <Suspense>
              <User />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to={pathUser.profile} />,
            },
            {
              path: pathUser.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              ),
            },
            {
              path: pathUser.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              ),
            },
            {
              path: pathUser.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          ),
        },

        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          ),
        },
      ],
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      ),
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      ),
    },
    {
      path: "*",
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      ),
    },
  ]);

  return <>{router}</>;
}

export default App;
