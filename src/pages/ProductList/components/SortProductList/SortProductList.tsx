import { sortBy, order as orderConst } from "../../../../consts/product";
import { ProductListConfig } from "../../../../types/product.type";
import classNames from "classnames";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { path } from "../../../../consts/const";
import _ from "lodash";
import { QueryConfig } from "../../../../hooks/useQueryConfig";

interface Props {
  pageSize: number;
  queryConfig: QueryConfig;
}

export default function SortProductList({ pageSize, queryConfig }: Props) {
  const page = Number(queryConfig.page);
  const { sort_by = sortBy.createdAt, order } = queryConfig;
  const navigate = useNavigate();

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig["sort_by"], undefined>) => {
    return sort_by === sortByValue;
  };

  const handleSort = (sortByValue: Exclude<ProductListConfig["sort_by"], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        _.omit(
          {
            ...queryConfig,
            sort_by: sortByValue,
          },
          ["order"],
        ),
      ).toString(),
    });
  };

  const handleOrderPrice = (orderValue: Exclude<ProductListConfig["order"], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        order: orderValue,
        sort_by: sortBy.price,
      }).toString(),
    });
  };

  return (
    <div className="bg-gray-300/40 px-3 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleSort(sortBy.view)}
            className={classNames("h-8 px-4 text-center text-sm capitalize", {
              "bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.view),
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.view),
            })}
          >
            Phổ biến
          </button>
          <button
            onClick={() => handleSort(sortBy.createdAt)}
            className={classNames("h-8 px-4 text-center text-sm capitalize", {
              "bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.createdAt),
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.createdAt),
            })}
          >
            Mới nhất
          </button>
          <button
            onClick={() => handleSort(sortBy.sold)}
            className={classNames("h-8 px-4 text-center text-sm capitalize", {
              "bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.sold),
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.sold),
            })}
          >
            Bán chạy
          </button>
          <select
            name=""
            id=""
            className={classNames("h-8 px-4 text-left text-sm capitalize", {
              "text-black outline-none hover:bg-slate-100": !isActiveSortBy(sortBy.price),
              "bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.price),
            })}
            value={order || ""}
            onChange={(event) => handleOrderPrice(event.target.value as Exclude<ProductListConfig["order"], undefined>)}
          >
            <option className="bg-white text-black" value="" disabled>
              Giá
            </option>
            <option className="bg-white text-black" value={orderConst.asc}>
              Giá thấp đến cao
            </option>
            <option className="bg-white text-black" value={orderConst.desc}>
              Giá cao đến thấp
            </option>
          </select>
        </div>
        <div className="flex items-center">
          <div>
            <span className="text-orange">1</span>
            <span>/{pageSize}</span>
          </div>
          <div className="ml-2 flex">
            {page === 1 ? (
              <span className="flex h-8 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white/60 px-3 shadow hover:bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString(),
                  }).toString(),
                }}
                className="flex h-8 items-center justify-center rounded-bl-sm rounded-tl-sm bg-white px-3 shadow hover:bg-slate-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className="flex h-8 cursor-not-allowed items-center justify-center rounded-br-sm rounded-tr-sm bg-white/60 px-3 shadow hover:bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString(),
                  }).toString(),
                }}
                className="flex h-8 items-center justify-center rounded-br-sm rounded-tr-sm bg-white px-3 shadow hover:bg-slate-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
