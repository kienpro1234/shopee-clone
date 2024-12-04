import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import omit from "lodash/omit";

import { schema } from "../../utils/rules";
import authApi from "../../apis/auth.api";
import Input from "../../components/UI/Input/Input";
import { isUnprocessableEntity } from "../../utils/utils";
import { ErrorResponse } from "../../types/utils.type";
import { toast } from "react-toastify";
import ButtonRegister from "../../components/UI/ButtonRegister";
import { useContext } from "react";
import { AppContext } from "../../context/app.context";

export interface formData {
  email: string;
  password: string;
  confirmed_password: string;
}

const schemaRegister = schema.pick(["email", "password", "confirmed_password"]);

export default function Register() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const {
    register,
    // watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(schemaRegister),
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirmed_password"]);
    useRegisterMutation.mutate(body);
  });

  const useRegisterMutation = useMutation({
    mutationFn: (body: Omit<formData, "confirmed_password">) => authApi.registerAccount(body),
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setProfile(data.data.data.user);
      toast.success("Đăng kí thành công");
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      if (isUnprocessableEntity<ErrorResponse<Omit<formData, "confirmed_password">>>(error)) {
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
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form noValidate onSubmit={onSubmit} className="rounded bg-white p-10 shadow-sm">
              <div className="text-2xl">Đăng Kí</div>
              <Input
                register={register}
                type="email"
                className="mt-8"
                errorMessage={errors.email?.message}
                placeholder="Email"
                name="email"
              />

              <Input
                name="password"
                register={register}
                type="password"
                className="mt-2"
                errorMessage={errors.password?.message}
                placeholder="Password"
              />

              <Input
                name="confirmed_password"
                register={register}
                type="password"
                className="mt-2"
                errorMessage={errors.confirmed_password?.message}
                placeholder="Confirm Password"
              />
              <div className="mt-2">
                <ButtonRegister
                  disabled={useRegisterMutation.isPending}
                  isLoading={useRegisterMutation.isPending}
                  className="w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600"
                >
                  {" "}
                  Đăng Kí
                </ButtonRegister>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <span className="me-1 text-gray-400"> Bạn đã có tài khoản</span>
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
