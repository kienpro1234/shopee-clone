import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { path } from "../../../../consts/const";
import ButtonRegister from "../../../../components/UI/ButtonRegister";
import { QueryConfig } from "../../ProductList";
import { Category } from "../../../../types/category.type";
import classNames from "classnames";
import InputNumber from "../../../../components/UI/InputNumber";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Schema, schema } from "../../../../utils/rules";
import { NoUndefinedField } from "../../../../types/utils.type";
import { ObjectSchema } from "yup";
import RatingStars from "../../../RatingStars";
import _ from "lodash";

interface Props {
  queryConfig: QueryConfig;
  categories: Category[];
}

// interface FormData {
//   price_min: string;
//   price_max: string;
// }

type PriceSchema = NoUndefinedField<Pick<Schema, "price_min" | "price_max">>;
const priceSchema = schema.pick(["price_min", "price_max"]);

export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig;
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<PriceSchema>({
    defaultValues: {
      price_min: "",
      price_max: "",
    },
    resolver: yupResolver(priceSchema as ObjectSchema<PriceSchema>),
    shouldFocusError: false,
  });
  // console.log(watch());

  const onSubmit = handleSubmit((data) => {
    // console.log("data success", data);
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min,
      }).toString(),
    });
  });

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        _.omit(queryConfig, ["price_max", "price_min", "rating_filter", "category"]),
      ).toString(),
    });
  };

  console.log(createSearchParams(queryConfig).toString());
  return (
    <div className="py-4">
      <Link
        to={path.home}
        className={classNames("flex items-center font-bold text-black", {
          "font-semibold text-orange": !category,
        })}
      >
        <svg viewBox="0 0 12 10" className="mr-3 h-4 w-3 fill-current">
          <g fillRule="evenodd" stroke="none" strokeWidth={1}>
            <g transform="translate(-373 -208)">
              <g transform="translate(155 191)">
                <g transform="translate(218 17)">
                  <path d="m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className="my-4 h-[1px] bg-gray-300"></div>
      <ul>
        {categories.map((cateItem) => {
          const isActive = category === cateItem._id;
          return (
            <li className="py-2 pl-2" key={cateItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: cateItem._id,
                  }).toString(),
                }}
                className={classNames("relative px-2", {
                  "font-semibold text-orange": isActive,
                })}
              >
                {isActive && (
                  <svg viewBox="0 0 4 7" className="absolute left-[-10px] top-1 h-2 w-2 fill-orange">
                    <polygon points="4 3.5 0 0 0 7" />
                  </svg>
                )}

                {cateItem.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to={path.home} className="mt-4 flex items-center font-bold uppercase">
        <svg
          enableBackground="new 0 0 15 15"
          viewBox="0 0 15 15"
          x={0}
          y={0}
          className="mr-3 h-4 w-3 fill-current stroke-current"
        >
          <g>
            <polyline
              fill="none"
              points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className="my-4 h-[1px] bg-gray-300"></div>
      <div className="my-5">
        <div>Khoảng giá</div>
        <form className="mt-2" onSubmit={onSubmit}>
          <div className="flex items-start">
            <Controller
              control={control}
              name="price_min"
              render={({ field }) => {
                return (
                  <InputNumber
                    type="text"
                    className="grow"
                    classNameError="hidden"
                    classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                    placeholder="₫ TỪ"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger("price_max");
                    }}

                    // value={field.value}
                    // ref={field.ref}
                  />
                );
              }}
            />

            <div className="mx-2 mt-2 shrink-0">-</div>
            <Controller
              control={control}
              name="price_max"
              render={({ field }) => {
                return (
                  <InputNumber
                    type="text"
                    className="grow"
                    classNameError="hidden"
                    classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                    placeholder="₫ ĐẾN"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger("price_min");
                    }}
                    // value={field.value}
                    // ref={field.ref}
                  />
                );
              }}
            />
          </div>
          <div className="mt-1 min-h-[1.25rem] text-sm text-red-600">
            {errors.price_min?.message || errors.price_max?.message}
          </div>
          <ButtonRegister className="flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80">
            Áp dụng
          </ButtonRegister>
        </form>
      </div>
      <div className="my-4 h-[1px] bg-gray-300"></div>
      <div className="text-sm">Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className="my-4 h-[1px] bg-gray-300"></div>
      <ButtonRegister
        onClick={handleRemoveAll}
        className="flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80"
      >
        Xóa tất cả
      </ButtonRegister>
    </div>
  );
}
