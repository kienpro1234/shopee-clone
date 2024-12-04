import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import Input from "../../../../components/UI/Input/Input";
import ButtonRegister from "../../../../components/UI/ButtonRegister";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "../../../../apis/user.api";
import { userSchema, UserSchema } from "../../../../utils/rules";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputNumber from "../../../../components/UI/InputNumber";
import DateSelect from "../../components/DateSelect";
import { toast } from "react-toastify";
import { AppContext } from "../../../../context/app.context";
import { setProfileToLS } from "../../../../utils/auth";
import userImage from "../../../../assets/images/userImage.svg";
import { isUnprocessableEntity } from "../../../../utils/utils";
import { ErrorResponse } from "../../../../types/utils.type";
import InputFile from "../../../../components/InputFile";
type FormData = Pick<UserSchema, "name" | "address" | "phone" | "date_of_birth" | "avatar">;
type FormDataError = Omit<FormData, "date_of_birth"> & {
  date_of_birth: string;
};

const profileSchema = userSchema.pick(["name", "address", "phone", "date_of_birth", "avatar"]);

function Info() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Fragment>
      <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
        <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Tên</div>
        <div className="sm:w-[80%] sm:pl-5">
          <Input
            classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
            register={register}
            name="name"
            placeholder="Tên"
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
        <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Số điện thoại</div>
        <div className="sm:w-[80%] sm:pl-5">
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <InputNumber
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                errorMessage={errors.phone?.message}
                placeholder="Số điện thoại"
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default function Profile() {
  const [file, setFile] = useState<File>();

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  const { setProfile } = useContext(AppContext);
  const { data: profileData, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      refetch();
      setProfileToLS(data.data.data);
      toast.success(data.data.message);
      setProfile(data.data.data);
    },
    onError: () => {
      // console.error(err);
    },
  });

  const profile = profileData?.data.data;
  console.log(profile);

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar,
    onSuccess: () => {},
    onError: () => {},
  });
  const methods = useForm<FormData>({
    defaultValues: {
      address: "",
      avatar: "",
      date_of_birth: new Date(1990, 0, 1),
      name: "",
      phone: "",
    },
    resolver: yupResolver(profileSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = methods;

  const avatar = watch("avatar");

  // quan sát có profile thì đổ thông tin lên form, hiển thị lên, do trong form này, input có thứ như {...field} hay {...register} nên nó đã đc gán value, onChange hết rồi, như 2 way binding vậy
  useEffect(() => {
    if (profile) {
      setValue("name", profile.name);
      setValue("phone", profile.phone);
      setValue("address", profile.address);
      setValue("avatar", profile.avatar);
      setValue("date_of_birth", profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1));
    }
  }, [profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log("data", data);
    try {
      let avatarUrl = avatar;
      if (file) {
        const form = new FormData();
        form.append("image", file);
        const uploadRes = await uploadAvatarMutation.mutateAsync(form);
        avatarUrl = uploadRes.data.data;
      }
      await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString() as string,
        avatar: avatarUrl,
      });
    } catch (err) {
      if (isUnprocessableEntity<ErrorResponse<FormDataError>>(err)) {
        const formError = err.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: "Server",
            });
          });
        }
      }
    }
  });

  const handleChangeUpload = (file?: File) => {
    if (file) {
      setFile(file);
    }
  };

  console.log("errors", errors);
  return (
    <div className="rounded-sm bg-white px-7 pb-20 shadow">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">Hồ sơ của tôi</h1>
        <div className="mt-1 text-sm text-gray-700">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className="mt-8 flex flex-col-reverse md:flex-row md:items-start" onSubmit={onSubmit}>
          <div className="mt-6 flex-grow pr-0 md:mt-0 md:pr-12">
            <div className="flex flex-wrap">
              <div className="mr-1 truncate pt-3 capitalize sm:mr-0 sm:w-[20%] sm:text-right">
                Email<span className="sm:hidden">:</span>
              </div>
              <div className="sm:w-[80%] sm:pl-5">
                <div className="pt-3 text-gray-700">{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
              <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Địa chỉ</div>
              <div className="sm:w-[80%] sm:pl-5">
                <Input
                  classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                  register={register}
                  name="address"
                  placeholder="Địa chỉ"
                  errorMessage={errors.name?.message}
                />
              </div>
            </div>
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
              <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right"></div>
              <div className="sm:w-[80%] sm:pl-5">
                <ButtonRegister
                  className="flex h-9 items-center bg-orange px-5 text-center text-sm text-white hover:bg-orange/80"
                  type="submit"
                >
                  Lưu
                </ButtonRegister>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:w-72 md:border-l md:border-l-gray-200">
            <div className="flex flex-col items-center">
              <div className="my-5 size-24">
                <img
                  src={previewImage || avatar || userImage}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <InputFile onChange={handleChangeUpload} />

              <div className="mt-3 text-gray-400">
                <div>Dung lượng file tối đa 1 MB</div>
                <div>Định dạng : .JPEG, .PNG, .JPG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
