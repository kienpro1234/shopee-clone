import { useState } from "react";
import { FieldPath, FieldValues, useController, type RegisterOptions, type UseControllerProps } from "react-hook-form";
import React from "react";

export interface InputNumberProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions;
  classNameInput?: string;
  classNameError?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: UseControllerProps<TFieldValues, TName> & InputNumberProps) {
  const {
    type,
    onChange,
    className,
    classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
    classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
    value = "",
    ...rest
  } = props;
  const { field, fieldState } = useController(props);
  const [localValue, setLocalValue] = useState<string>(field.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = e.target.value;
    const numberCondition = type === "number" && (/^\d+$/.test(valueFromInput) || valueFromInput === "");
    if (numberCondition || type !== "number") {
      //cập nhật localValue state
      setLocalValue(valueFromInput);

      //Gọi field.onChange để cập nhật vào state react hook form
      field.onChange(e);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(e);
    }
  };
  return (
    <div className={className}>
      <input className={classNameInput} {...field} value={value || localValue} onChange={handleChange} {...rest} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  );
}

export default InputV2;

// type Gen<TFunc> = {
//   getName: TFunc;
// };

// function Hexa<TFunc extends () => string, TLastName extends ReturnType<TFunc>>(props: {
//   person: Gen<TFunc>;
//   lastName: TLastName;
// }) {
//   return null;
// }

// const handleName: () => "Duoc" = () => "Duoc";

// function App() {
//   return <Hexa person={{ getName: handleName }} lastName="Duoc" />;
// }
