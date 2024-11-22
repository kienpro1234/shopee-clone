import type { RegisterOptions, UseFormRegister } from "react-hook-form";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  errorMessage?: string;
  rules?: RegisterOptions;
  classNameInput?: string;
  classNameError?: string;
}

export default function Input({
  register,
  className,
  errorMessage,
  name,
  autoComplete,
  rules,
  classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
  classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {};
  return (
    <div className={className}>
      <input autoComplete={autoComplete} className={classNameInput} {...rest} {...registerResult} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}
