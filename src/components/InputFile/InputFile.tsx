import React, { Fragment, useRef } from "react";
import { toast } from "react-toastify";
import { maxSizeUploadAvatar } from "../../consts/const";

interface Props {
  onChange: (file?: File) => void;
}

export default function InputFile({ onChange }: Props) {
  // const [file, setFile] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];
    if (fileFromLocal && (fileFromLocal.size >= maxSizeUploadAvatar || !fileFromLocal.type.includes("image"))) {
      toast.error("Dung lượng file tối đa 1 MB \n Định dạng : .JPEG, .PNG, .JPG");
    } else {
      //   setFile(fileFromLocal);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(fileFromLocal);
    }
  };
  return (
    <Fragment>
      <input
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={handleChangeFile}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event.target as any).value = null;
        }}
      />
      <button
        className="flex h-10 items-center justify-center rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
        type="button"
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  );
}
