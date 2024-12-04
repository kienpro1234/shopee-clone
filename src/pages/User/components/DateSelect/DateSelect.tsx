import range from "lodash/range";

import React, { useEffect, useState } from "react";

interface Props {
  onChange?: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

export default function DateSelect({ errorMessage, onChange, value }: Props) {
  const [date, setDate] = useState({
    day: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990,
  });

  useEffect(() => {
    if (value) {
      setDate({
        day: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear(),
      });
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target;
    const newDate = {
      day: value?.getDate() || date.day,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect),
    };

    setDate(newDate);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.day));
  };
  return (
    <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
      <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Ngày sinh</div>
      <div className="sm:w-[80%] sm:pl-5">
        <div className="flex flex-wrap justify-between">
          <select
            name="day"
            onChange={handleChange}
            className="h-8 w-[32%] cursor-pointer border border-black/10 px-3 hover:border-orange"
            value={value?.getDate() || date.day}
            id=""
          >
            <option value="" disabled>
              Ngày
            </option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name="month"
            onChange={handleChange}
            className="h-8 w-[32%] cursor-pointer border border-black/10 px-3 hover:border-orange"
            value={value?.getMonth() || date.month}
            id=""
          >
            <option value="" disabled>
              Tháng
            </option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            name="year"
            onChange={handleChange}
            className="h-8 w-[32%] cursor-pointer border border-black/10 px-3 hover:border-orange"
            value={value?.getFullYear() || date.year}
            id=""
          >
            <option value="" disabled>
              Năm
            </option>
            {range(1990, 2025).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errorMessage}</div>
      </div>
    </div>
  );
}
