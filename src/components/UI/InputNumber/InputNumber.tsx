import { forwardRef } from "react";
import type { RegisterOptions } from "react-hook-form";
import React from "react";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage?: string;
  rules?: RegisterOptions;
  classNameInput?: string;
  classNameError?: string;
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumber(
  {
    className,
    errorMessage,

    autoComplete,

    classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
    classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
    onChange,
    ...rest
  },
  ref,
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("bro");
    const { value } = e.target;
    if ((/^\d+$/.test(value) || value === "") && onChange) {
      onChange(e);
    }
  };
  return (
    <div className={className}>
      <input autoComplete={autoComplete} className={classNameInput} {...rest} onChange={handleChange} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
});

export default InputNumber;
