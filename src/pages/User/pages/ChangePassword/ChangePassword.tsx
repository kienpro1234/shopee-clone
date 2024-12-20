import Input from "../../../../components/UI/Input/Input";
import ButtonRegister from "../../../../components/UI/ButtonRegister";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSchema, userSchema } from "../../../../utils/rules";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../../../apis/user.api";
import { toast } from "react-toastify";
import omit from "lodash/omit";
import { isUnprocessableEntity } from "../../../../utils/utils";
import { ErrorResponse } from "../../../../types/utils.type";

type FormData = Pick<UserSchema, "password" | "new_password" | "confirm_password">;
const passwordSchema = userSchema.pick(["password", "new_password", "confirm_password"]);

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      new_password: "",
      confirm_password: "",
    },
    resolver: yupResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
    },
    onError: () => {
      // console.error(err);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("data", data);
    try {
      await updateProfileMutation.mutateAsync(omit(data, ["confirm_password"]));
    } catch (err) {
      if (isUnprocessableEntity<ErrorResponse<FormData>>(err)) {
        const formError = err.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: "Server",
            });
          });
        }
      }
    }
  });

  return (
    <div className="rounded-sm bg-white px-7 pb-20 shadow">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">Đổi mật khẩu</h1>
        <div className="mt-1 text-sm text-gray-700">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>

      <form className="mt-8 max-w-2xl" onSubmit={onSubmit}>
        <div className="mt-6 flex-grow pr-0 md:mt-0 md:pr-12">
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Mật khẩu cũ</div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                name="password"
                type="password"
                placeholder="Mật khẩu cũ"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Mật khẩu mới</div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                name="new_password"
                type="password"
                placeholder="Mật khẩu mới"
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Nhập lại mật khẩu</div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                name="confirm_password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right"></div>
            <div className="sm:w-[80%] sm:pl-5">
              <ButtonRegister
                className="flex h-9 items-center bg-orange px-5 text-center text-sm text-white hover:bg-orange/80"
                type="submit"
              >
                Lưu
              </ButtonRegister>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
