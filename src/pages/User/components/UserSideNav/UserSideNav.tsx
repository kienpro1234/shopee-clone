import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { pathUser } from "../../../../consts/const";
import { AppContext } from "../../../../context/app.context";
import userImage from "../../../../assets/images/userImage.svg";
import classNames from "classnames";

export default function UserSideNav() {
  const { profile } = useContext(AppContext);
  return (
    <div>
      <div className="flex items-center border-b border-b-gray-200 py-4">
        <NavLink
          to={pathUser.profile}
          className={"size-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10"}
        >
          <img src={profile?.avatar || userImage} alt="user avatar" className="h-full w-full object-cover" />
        </NavLink>
        <div className="flex-grow pl-4">
          <div className="mb-1 truncate font-semibold text-gray-600">{profile?.name}</div>
          <NavLink to={pathUser.profile} className="flex items-center capitalize text-gray-500">
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 4 }}
            >
              <path
                d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                fill="#9B9B9B"
                fillRule="evenodd"
              />
            </svg>
            Sửa hồ sơ
          </NavLink>
        </div>
      </div>
      <div className="mt-7 space-y-3">
        <NavLink
          className={({ isActive }) =>
            classNames("flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
          to={pathUser.profile}
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              className="h-full w-full"
              src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
              alt=""
            />
          </div>
          <span>Tài khoản của tôi</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            classNames("flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
          to={pathUser.changePassword}
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              className="h-full w-full"
              src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
              alt=""
            />
          </div>
          <span>Đổi mật khẩu</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            classNames("flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
          to={pathUser.historyPurchase}
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              className="h-full w-full"
              src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078"
              alt=""
            />
          </div>
          <span>Đơn mua</span>
        </NavLink>
      </div>
    </div>
  );
}
