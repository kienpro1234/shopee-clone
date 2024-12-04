import { createSearchParams, Link } from "react-router-dom";
import { path } from "../../../../consts/const";
import { purchasesStatus } from "../../../../consts/purchase.const";
import classNames from "classnames";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import purchaseApi from "../../../../apis/purchase.api";
import { PurchaseListStatus } from "../../../../types/purchase.type";
import { formatCurrency, generateNameId } from "../../../../utils/utils";

const purchaseTabs = [
  { status: purchasesStatus.all, name: "Tất cả" },
  { status: purchasesStatus.waitForConfirmation, name: "Chờ xác nhận" },
  { status: purchasesStatus.waitForGetting, name: "Chờ lấy hàng" },
  { status: purchasesStatus.inProgress, name: "Đang giao" },
  { status: purchasesStatus.delivered, name: "Đã giao" },
  { status: purchasesStatus.cancelled, name: "Đã hủy" },
];

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams();
  const status: number = Number(queryParams.status) || purchasesStatus.all;

  const { data: purchasesData } = useQuery({
    queryKey: ["purchases", { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus }),
  });

  const purchases = purchasesData?.data.data;

  const purchaseTabLinks = purchaseTabs.map((link, index) => (
    <Link
      key={index}
      to={{
        search: createSearchParams({
          status: String(link.status),
        }).toString(),
      }}
      className={classNames("flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center", {
        "border-b-orange text-orange": status === link.status,
        "border-b-black/10 text-gray-900": status !== link.status,
      })}
    >
      {link.name}
    </Link>
  ));
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div>
            <div className="sticky top-0 flex rounded-t-sm shadow-sm">{purchaseTabLinks}</div>

            <div>
              {purchases?.map((purchase) => (
                <div
                  key={purchase._id}
                  className="mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm"
                >
                  <Link
                    to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                    className="flex"
                  >
                    <div className="flex-shrink-0">
                      <img className="size-20 object-cover" src={purchase.product.image} alt={purchase.product.name} />
                    </div>
                    <div className="overlow-hidden ml-3 flex-grow">
                      <div className="truncate text-wrap">{purchase.product.name}</div>
                      <div className="mt-3">x{purchase.buy_count}</div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="truncate text-gray-500 line-through">
                        ₫{formatCurrency(purchase.product.price_before_discount)}
                      </span>
                      <span className="ml-3 truncate text-orange">
                        ₫{formatCurrency(purchase.product.price_before_discount)}
                      </span>
                    </div>
                  </Link>
                  <div className="flex justify-end">
                    <div>
                      <span>Tổng giá tiền</span>
                      <span className="ml-4 text-xl text-orange">
                        ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
