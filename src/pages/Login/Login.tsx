import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Schema, schema } from "../../utils/rules";

import Input from "../../components/UI/Input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { isUnprocessableEntity } from "../../utils/utils";

import { useMutation } from "@tanstack/react-query";
import authApi from "../../apis/auth.api";
import { ErrorResponse } from "../../types/utils.type";
import { useContext } from "react";
import { AppContext } from "../../context/app.context";
import { toast } from "react-toastify";
import ButtonRegister from "../../components/UI/ButtonRegister";

type FormData = Pick<Schema, "email" | "password">;
const schemaLogin = schema.pick(["email", "password"]);

export default function Login() {
  const { login } = authApi;
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    // getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaLogin),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    useLoginMutation.mutate(data);
  });
  console.log(errors);

  const useLoginMutation = useMutation({
    mutationFn: (body: FormData) => login(body),
    onSuccess: (data) => {
      toast.success("Đăng nhập thành công");
      setProfile(data.data.data.user);
      setIsAuthenticated(true);
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      if (isUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: "Server",
            });
          });
        }
      }
    },
  });

  return (
    <div className="bg-orange">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form noValidate onSubmit={onSubmit} className="rounded bg-white p-10 shadow-sm">
              <div className="text-2xl">Đăng Nhập</div>

              <Input
                name="email"
                register={register}
                type="email"
                className="relative mt-8"
                errorMessage={errors.email?.message}
                placeholder="Email"
                autoComplete="on"
              />

              <Input
                name="password"
                register={register}
                type="password"
                className="relative mt-3"
                errorMessage={errors.password?.message}
                placeholder="Password"
                autoComplete="on"
              />
              <div className="mt-3">
                <ButtonRegister
                  isLoading={useLoginMutation.isPending}
                  disabled={useLoginMutation.isPending}
                  className="w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600"
                >
                  {" "}
                  Đăng nhập
                </ButtonRegister>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <span className="me-1 text-gray-400"> Bạn chưa có tài khoản</span>
                <Link className="text-red-400" to={"/register"}>
                  Đăng kí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
