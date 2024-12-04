import React, { useState } from "react";
import InputNumber, { InputNumberProps } from "../UI/InputNumber";

interface Props extends InputNumberProps {
  max?: number;
  onIncrease?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  classNameWrapper?: string;
  onFocusOut?: (value: number) => void;
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  value,
  classNameWrapper = "ml-10",
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState(Number(value) || 0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value);
    if (max !== undefined && _value > max) {
      _value = max;
    } else if (_value < 1) {
      _value = 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onType && onType(_value);

    setLocalValue(_value);
  };

  const increase = () => {
    let _value = Number(value || localValue) + 1;
    if (max !== undefined && _value > max) {
      _value = max;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onIncrease && onIncrease(_value);
    setLocalValue(_value);
  };

  const decrease = () => {
    let _value = Number(value || localValue) - 1;
    if (_value < 1) {
      _value = 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onDecrease && onDecrease(_value);
    setLocalValue(_value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onFocusOut && onFocusOut(Number(e.target.value));
  };
  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button
        className="broder-gray-300 flex size-8 items-center justify-center rounded-l-sm border text-gray-600"
        onClick={decrease}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>
      <InputNumber
        value={value || localValue}
        className=""
        classNameError="hidden"
        classNameInput="h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none"
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
      <button
        className="broder-gray-300 flex size-8 items-center justify-center rounded-r-sm border text-gray-600"
        onClick={increase}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}
