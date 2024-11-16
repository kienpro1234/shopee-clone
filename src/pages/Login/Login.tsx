import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Schema, schema } from "../../utils/rules";

import Input from "../../components/UI/Input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { isUnprocessableEntity } from "../../utils/utils";
import { ResponseApi } from "../../types/utils.type";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apis/auth.api";

type FormData = Omit<Schema, "confirmed_password">;

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    // getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema.omit(["confirmed_password"])),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    useLoginMutation.mutate(data);
  });
  console.log(errors);

  const useLoginMutation = useMutation({
    mutationFn: (body: FormData) => login(body),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
      if (isUnprocessableEntity<ResponseApi<FormData>>(error)) {
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form noValidate onSubmit={onSubmit} className="p-10 rounded bg-white shadow-sm">
              <div className="text-2xl">Đăng Nhập</div>

              <Input
                name="email"
                register={register}
                type="email"
                className="mt-8"
                errorMessage={errors.email?.message}
                placeHolder="Email"
              />

              <Input
                name="password"
                register={register}
                type="password"
                className="mt-3"
                errorMessage={errors.password?.message}
                placeHolder="Password"
              />
              <div className="mt-3">
                <button className="w-full text-center py-4 px-2 uppercase bg-red-500 hover:bg-red-600 text-white text-sm">
                  {" "}
                  Đăng nhập
                </button>
              </div>
              <div className="flex justify-center items-center mt-8">
                <span className="text-gray-400 me-1"> Bạn chưa có tài khoản</span>
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
