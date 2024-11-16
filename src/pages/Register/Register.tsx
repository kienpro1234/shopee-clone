import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";

import { schema } from "../../utils/rules";
import { registerAccount } from "../../apis/auth.api";
import Input from "../../components/UI/Input/Input";
import { isUnprocessableEntity } from "../../utils/utils";
import { ResponseApi } from "../../types/utils.type";

export interface formData {
  email: string;
  password: string;
  confirmed_password: string;
}

export default function Register() {
  const {
    register,
    // watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    const body = _.omit(data, ["confirmed_password"]);
    useRegisterMutation.mutate(body);
  });

  const useRegisterMutation = useMutation({
    mutationFn: (body: Omit<formData, "confirmed_password">) => registerAccount(body),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
      if (isUnprocessableEntity<ResponseApi<Omit<formData, "confirmed_password">>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof Omit<formData, "confirmed_password">, {
              message: formError[key as keyof Omit<formData, "confirmed_password">],
              type: "Server",
            });
          });
        }
        // if (formError?.email) {
        //   setError("email", {
        //     message: formError.email,
        //     type: "Server",
        //   });
        // }
        // if (formError?.password) {
        //   setError("password", {
        //     message: formError.password,
        //     type: "server",
        //   });
        // }
      }
    },
  });

  return (
    <div className="bg-orange">
      <div className="max-w-7xl mx-auto px-4 container">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form noValidate onSubmit={onSubmit} className="p-10 rounded bg-white shadow-sm">
              <div className="text-2xl">Đăng Kí</div>
              <Input
                register={register}
                type="email"
                className="mt-8"
                errorMessage={errors.email?.message}
                placeHolder="Email"
                name="email"
              />

              <Input
                name="password"
                register={register}
                type="password"
                className="mt-2"
                errorMessage={errors.password?.message}
                placeHolder="Password"
              />

              <Input
                name="confirmed_password"
                register={register}
                type="password"
                className="mt-2"
                errorMessage={errors.confirmed_password?.message}
                placeHolder="Confirm Password"
              />
              <div className="mt-2">
                <button className="w-full text-center py-4 px-2 uppercase bg-red-500 hover:bg-red-600 text-white text-sm">
                  {" "}
                  Đăng Kí
                </button>
              </div>

              <div className="flex justify-center items-center mt-8">
                <span className="text-gray-400 me-1"> Bạn đã có tài khoản</span>
                <Link className="text-red-400" to={"/login"}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
