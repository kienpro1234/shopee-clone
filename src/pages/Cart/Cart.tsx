import React, { useContext, useEffect, useMemo } from "react";
import purchaseApi from "../../apis/purchase.api";
import { purchasesStatus } from "../../consts/purchase.const";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { path } from "../../consts/const";
import { formatCurrency, generateNameId } from "../../utils/utils";
import QuantityController from "../../components/QuantityController";
import ButtonRegister from "../../components/UI/ButtonRegister";
import { Purchase } from "../../types/purchase.type";
import { produce } from "immer";
import keyBy from "lodash/keyBy";
import { toast } from "react-toastify";
import { AppContext } from "../../context/app.context";
import noproductImg from "../../assets/images/no-product.png";

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);

  const location = useLocation();

  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId;
  const { data: purchasesInCartData, refetch: refetchPurchasesInCart } = useQuery({
    queryKey: ["purchases", { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetchPurchasesInCart();
    },
    onError: (err) => {
      console.error("err", err);
    },
  });

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProduct,
    onSuccess: (data) => {
      toast.success(data.data.message);
      refetchPurchasesInCart();
    },
  });

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetchPurchasesInCart();
    },
  });

  const purchasesInCart = purchasesInCartData?.data.data;
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases]);
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((acc, current) => {
        return acc + current.product.price * current.buy_count;
      }, 0),
    [checkedPurchases],
  );

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((acc, current) => {
        return acc + (current.product.price_before_discount - current.product.price) * current.buy_count;
      }, 0),
    [checkedPurchases],
  );
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, "_id");

      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseIdFromLocation = choosenPurchaseIdFromLocation === purchase._id;
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseIdFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked),
          };
        }) || []
      );
    });
  }, [purchasesInCart, choosenPurchaseIdFromLocation]);

  useEffect(() => {
    return () => {
      history.replaceState(null, "");
    };
  }, []);

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((prevExtendedPurchases) => {
        prevExtendedPurchases[purchaseIndex].checked = event.target.checked;
      }),
    );
  };

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked,
      })),
    );
  };

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex];
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        }),
      );

      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value });
    }
  };

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      }),
    );
  };

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id;
    deletePurchasesMutation.mutate([purchaseId]);
  };

  const handleDeleteMany = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchasesMutation.mutate(purchasesIds);
  };

  const handleBuyProduct = () => {
    if (checkedPurchasesCount > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count,
      }));
      buyProductsMutation.mutate(body);
    }
  };

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        {extendedPurchases.length > 0 ? (
          <>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input
                          type="checkbox"
                          className="size-5 accent-orange"
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className="flex-grow text-black">Sản phẩm</div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng</div>
                      <div className="col-span-1">Số tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow">
                    {extendedPurchases?.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className="border-gray-2F00 mt-5 grid grid-cols-12 items-center rounded-sm border bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input
                                type="checkbox"
                                className="size-5 accent-orange"
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  className="size-20 flex-shrink-0"
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id,
                                  })}`}
                                >
                                  <img
                                    className="h-full w-full object-cover"
                                    src={purchase.product.image}
                                    alt={purchase.product.name}
                                  />
                                </Link>
                                <div className="flex-grow px-2 pb-2 pt-1">
                                  <Link
                                    className="line-clamp-2 text-left"
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id,
                                    })}`}
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-300 line-through">
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className="ml-3">₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper=""
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => {
                                  console.log(value >= 1);
                                  console.log(value);
                                  handleQuantity(index, value, value > 1);
                                }}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count,
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className="col-span-1 text-orange">
                              ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                            </div>
                            <div className="col-span-1">
                              <button
                                className="bg-none text-black transition-colors hover:text-orange"
                                onClick={handleDelete(index)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 z-10 flex flex-col rounded-sm border border-gray-100 bg-white p-2 shadow sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-center">
                <div className="pr-3">
                  <input
                    type="checkbox"
                    className="size-5 accent-orange"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button className="mx-3 border-none bg-none" onClick={handleCheckAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button className="mx-3 border-none bg-none" onClick={handleDeleteMany}>
                  Xóa
                </button>
              </div>
              <div className="mt-5 flex flex-col items-center sm:ml-auto sm:mt-0 sm:flex-row">
                <div>
                  <div className="flex items-center sm:justify-end">
                    <div className="">Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className="ml-2 text-2xl text-orange">₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className="flex items-center text-sm sm:justify-end">
                    <div className="text-gray-500">Tiết kiệm</div>
                    <div className="ml-6 text-orange">₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <ButtonRegister
                  className="ml-4 mt-2 h-10 w-52 rounded-sm bg-red-500 text-center text-sm uppercase text-white hover:bg-red-600 sm:mt-0"
                  onClick={handleBuyProduct}
                  disabled={buyProductsMutation.isPending}
                  isLoading={buyProductsMutation.isPending}
                >
                  Mua hàng
                </ButtonRegister>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div>
              <img className="mx-auto size-24" src={noproductImg} alt="no purchase" />
            </div>
            <div className="mt-5 font-bold text-gray-400">Giỏ hàng của bạn còn trống</div>
            <div className="mt-5">
              <Link
                className="bg-orange px-10 py-2 uppercase text-white transition-all hover:bg-orange/80"
                to={path.home}
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
