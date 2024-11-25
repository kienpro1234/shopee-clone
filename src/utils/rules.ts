import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import { formData } from "../pages/Register/Register";
import * as yup from "yup";

export type Rules = {
  [key in "email" | "password" | "confirmed_password"]?: RegisterOptions<formData>;
};

export const getRules = (getValues?: UseFormGetValues<formData>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Email không đúng định dạng",
    },
    minLength: {
      value: 5,
      message: "Độ dài email không được bé hơn 5",
    },
    maxLength: {
      value: 160,
      message: "Độ dài email không được lớn hơn 160",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password là bắt buộc",
    },
    minLength: {
      value: 6,
      message: `Độ dài email không được bé hơn 6`,
    },
    maxLength: {
      value: 160,
      message: "Độ dài email không được lớn hơn 160",
    },
  },
  confirmed_password: {
    required: {
      value: true,
      message: "Nhập lại password là bắt buộc",
    },
    minLength: {
      value: 6,
      message: `Độ dài email không được bé hơn 6`,
    },
    maxLength: {
      value: 160,
      message: "Độ dài email không được lớn hơn 160",
    },
    validate:
      typeof getValues === "function"
        ? (v) => v === getValues("password") || "Nhập lại password không khớp"
        : undefined,
  },
});

function testMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string };
  if (price_min !== "" && price_max !== "") {
    return Number(price_max) >= Number(price_min);
  }
  return price_min !== "" || price_max !== "";
}

export const schema = yup
  .object({
    email: yup
      .string()
      .required("Email là bắt buộc")
      .min(5, "Độ dài không được bé hơn 5")
      .max(160, "Độ dài không được lớn hơn 160")
      .email("Email không đúng định dạng"),

    password: yup
      .string()
      .required("Password là bắt buộc")
      .min(6, "Độ dài email không được bé hơn 6")
      .max(160, "Độ dài email không được lớn hơn 160"),
    confirmed_password: yup
      .string()
      .required("Password là bắt buộc")
      .min(6, "Độ dài email không được bé hơn 6")
      .max(160, "Độ dài email không được lớn hơn 160")
      .oneOf([yup.ref("password")], "Nhập lại mật khẩu không khớp"),

    price_min: yup.string().test({
      name: "price-not-allowed",
      message: "Giá không phù hợp",
      test: testMinMax,
    }),
    price_max: yup.string().test({
      name: "price-not-allowed",
      message: "Giá không phù hợp",
      test: testMinMax,
    }),
    name: yup.string().trim().required("Name search Không được bỏ trống"),
  })
  .required();

export type Schema = yup.InferType<typeof schema>;
