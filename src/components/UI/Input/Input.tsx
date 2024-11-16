import type { UseFormRegister } from "react-hook-form";
import { formData } from "../../../pages/Register/Register";

interface Props {
  className?: string;
  type: React.HTMLInputTypeAttribute;
  placeHolder?: string;
  register: UseFormRegister<formData>;
  errorMessage?: string;
  name: keyof formData;
}

export default function Input({ register, type, className, errorMessage, placeHolder, name }: Props) {
  return (
    <div className={className}>
      <input
        autoComplete="on"
        type={type}
        className="p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
        placeholder={placeHolder}
        {...register(name)}
      />
      <div className="mt-1 text-red-600 min-h-[1.25rem] text-sm">{errorMessage}</div>
    </div>
  );
}
