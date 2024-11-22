export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}

// loại bỏ đi undefined trong các trường trong type hoặc interface
export type NoUndefinedField<T> = {
  [key in keyof T]-?: NoUndefinedField<NonNullable<T[key]>>;
};
