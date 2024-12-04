import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "../../apis/product.api";
import classNames from "classnames";
import ProductRating from "../../components/ProductRating";
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, solveRateSale } from "../../utils/utils";

import DOMPurify from "dompurify";
import { ProductListConfig } from "../../types/product.type";
import ProductItem from "../ProductList/components/ProductItem";
import QuantityController from "../../components/QuantityController";
import purchaseApi from "../../apis/purchase.api";
import { purchasesStatus } from "../../consts/purchase.const";
import { toast } from "react-toastify";
import { path } from "../../consts/const";

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1);
  const { nameId } = useParams();
  const navigate = useNavigate();
  const id = getIdFromNameId(nameId as string);

  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductDetail(id as string),
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState("");
  const product = data?.data.data;
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [currentIndexImages, product],
  );

  const queryClient = useQueryClient();

  const queryConfig: ProductListConfig = { limit: "20", page: "1", category: product?.category._id };
  const { data: productsData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig);
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000,
  });

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body),
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["purchases", { status: purchasesStatus.inCart }] });
    },
  });

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const next = () => {
    if (product && currentIndexImages[1] < product.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
    }
  };

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const image = imageRef.current as HTMLImageElement;
    const { naturalHeight, naturalWidth } = image;
    // const { offsetX, offsetY } = event.nativeEvent;
    const offsetX = event.pageX - (rect.x + window.scrollX);

    const offsetY = event.pageY - (rect.y + window.scrollY);
    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);

    image.style.width = naturalWidth + "px";
    image.style.height = naturalHeight + "px";
    image.style.maxWidth = "unset";

    image.style.top = top + "px";
    image.style.left = left + "px";
  };

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute("style");
  };

  const handleBuyCount = (value: number) => {
    setBuyCount(value);
  };

  const addToCart = () => {
    addToCartMutation.mutate({ buy_count: buyCount, product_id: product?._id as string });
  };

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string });
    const purchase = res.data.data;
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id,
      },
    });
  };

  if (!product) {
    return null;
  }
  return (
    <div className="bg-gray-200 py-6">
      <div className="container">
        <div className="bg-white p-4 shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div
                className="relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow"
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="absolute left-0 top-0 h-full w-full bg-white object-cover"
                  ref={imageRef}
                />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                {/* chevron prev */}
                <button className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/25" onClick={prev}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="{1.5}"
                    stroke="currentColor"
                    className="size-5 stroke-2 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {currentImages.map((img, index) => {
                  const isActive = img === activeImage;

                  return (
                    <div
                      className="relative w-full cursor-pointer pt-[100%]"
                      key={index}
                      onMouseEnter={() => setActiveImage(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className={classNames(
                          "absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover",
                        )}
                      />
                      {isActive && <div className="absolute inset-0 border-2 border-orange"></div>}
                    </div>
                  );
                })}
                {/* chevron next */}
                <button className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/25" onClick={next}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 stroke-2 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">{product.name}</h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-orange text-orange">{product.rating}</span>
                  <span>
                    <ProductRating
                      rating={product.rating}
                      activeClassname="fill-orange text-orange size-4"
                      nonActiveClassname="fill-gray-300 text-gray-300 size-4"
                    />
                  </span>
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.view)} </span>
                  <span>Đánh giá</span>
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span> Đã bán</span>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 bg-gray-50 px-5 py-4">
                <div className="text-3xl font-medium text-orange">₫{formatCurrency(product.price)}</div>
                <div className="text-gray-500 line-through">₫{formatCurrency(product.price_before_discount)}</div>
                <div className="rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold">
                  -{solveRateSale(product.price_before_discount, product.price)}
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <div className="capitalize text-gray-500">Số lượng</div>
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className="ml-6 text-sm text-gray-500">{product.quantity} sản phẩm có sẵn</div>
              </div>

              <div className="mt-8 flex items-center">
                <button
                  onClick={addToCart}
                  className="flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5"
                >
                  <img
                    className="mr-[10px]"
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/0f3bf6e431b6694a9aac.svg"
                    alt="cart icon"
                  />
                  <span className="capitalize">Thêm vào giỏ hàng</span>
                </button>
                <button
                  onClick={buyNow}
                  className="ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white p-4 shadow">
          <div className="rounded bg-gray-50 p-4 text-lg uppercase text-slate-700">Mô tả sản phẩm</div>
          <div className="mx-4 mb-4 mt-12 text-sm leading-loose">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="container">
          <div className="uppercase text-gray-400">CÓ THỂ BẠN CŨNG THÍCH</div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {productsData &&
              productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <ProductItem product={product} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
