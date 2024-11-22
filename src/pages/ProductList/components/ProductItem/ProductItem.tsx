import { Link } from "react-router-dom";
import { Product as ProductType } from "../../../../types/product.type";
import { formatCurrency, formatNumberToSocialStyle } from "../../../../utils/utils";

interface Props {
  product: ProductType;
}

export default function ProductItem({ product }: Props) {
  return (
    <Link to={"/"}>
      <div className="rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:border hover:border-orange hover:shadow-md">
        <div className="relative w-full pt-[100%]">
          <img src={product.image} alt={product.name} className="absolute left-0 top-0 h-full w-full object-cover" />
        </div>
        <div className="overflow-hidden p-2">
          <div className="line-clamp-2 min-h-[2rem] text-xs">{product.name}</div>
          <div className="mt-3 flex items-center">
            <div className="max-w-[50%] truncate text-gray-500 line-through">
              {formatCurrency(product.price_before_discount)}
            </div>
            <div className="ml-1 truncate text-orange">
              <span className="text-sx">₫</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                // fill="yellow"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3 fill-yellow-400 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>

              <div className="ml-1 text-xs">4.5</div>
            </div>
            <div className="ml-2 text-xs">
              <span className="mr-1">Đã bán</span>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
