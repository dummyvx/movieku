import { FunctionComponent, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  FireIcon,
} from "@heroicons/react/solid";

export type ToastType = "info" | "danger" | "warn";

export type ToastInfoType = Record<
  string,
  | {
      status: false;
      type: ToastType;
    }
  | {
      status: true;
      msg: string;
      label: string;
      type: ToastType;
    }
>;

interface IToast {
  show: boolean;
  onClose: () => void;
  label: string;
  msg: string;
  type: ToastType;
}

const Toast: FunctionComponent<IToast> = (props) => {
  const { show, onClose, label, msg, type } = props;
  const [isShow, setIsShow] = useState(show);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
      setIsShow(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  const Icon: FunctionComponent = () =>
    type === "info" ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : type === "danger" ? (
      <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
    ) : (
      <FireIcon className="w-5 h-5 text-yellow-500" />
    );

  const getTextColor = () =>
    type === "info"
      ? "text-green-500"
      : type === "danger"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div
      className={`fixed py-4 px-6 bg-gray-800 z-50 font-poppins flex items-start space-x-4 max-w-sm md:lg:max-w-md lg:max-w-lg ease-in-out duration-500 transition-all bottom-5 ${
        show ? "right-5 opacity-100" : "-right-72 opacity-0"
      }`}
    >
      <div>
        <Icon />
      </div>

      <div className="block">
        <h4 className={`${getTextColor()} text-sm font-medium mb-1`}>
          {label}
        </h4>
        <p className="text-gray-500 text-sm">{msg}</p>
      </div>
    </div>
  );
};

export default Toast;
