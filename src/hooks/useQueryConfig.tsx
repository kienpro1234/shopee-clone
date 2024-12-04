import isUndefined from "lodash/isUndefined";
import omitBy from "lodash/omitBy";
import useQueryParams from "./useQueryParams";
import { ProductListConfig } from "../types/product.type";

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      category: queryParams.category,
      exclude: queryParams.exclude,
      sort_by: queryParams.sort_by,
      limit: queryParams.limit || "20",
      name: queryParams.name,
      order: queryParams.order,
      page: queryParams.page || "1",
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
    },
    isUndefined,
  );

  return queryConfig;
}
