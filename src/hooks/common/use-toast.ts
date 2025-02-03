// import type { ToastOptions} from 'react-toastify';
// import {Bounce, toast} from 'react-toastify';
// import {useState} from "react";
//
// export function useToast() {
//     const [toastOptions, setToastOptions] = useState<ToastOptions>({
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: false,
//         progress: undefined,
//         transition: Bounce,
//     });
//
//     const showErrorToast = (message: string) => {
//         toast.error(message, toastOptions);
//     }
//     const showSuccessToast = (message: string) => {
//         toast.success(message, toastOptions);
//     }
//     const showInfoToast = (message: string) => {
//         toast.info(message, toastOptions);
//     }
//     const showWarningToast = (message: string) => {
//         toast.warning(message, toastOptions);
//     }
//
//     return {
//         showErrorToast,
//         showSuccessToast,
//         showInfoToast,
//         showWarningToast,
//         toastOptions,
//         setToastOptions
//     }
// }