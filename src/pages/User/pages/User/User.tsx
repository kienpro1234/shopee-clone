import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import UserLayout from "../../layouts/UserLayout";
import { Outlet } from "react-router-dom";

export default function User() {
  return (
    <>
      <MainLayout>
        <UserLayout>
          <Outlet />
        </UserLayout>
      </MainLayout>
    </>
  );
}
