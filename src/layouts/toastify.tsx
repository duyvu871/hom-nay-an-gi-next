import React, {JSX} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import type { ToastContainerProps} from "react-toastify";
import {ToastContainer} from "react-toastify";
import {Toaster} from "@globals/constant/default-component-props";

interface ToastProps {
    children?: React.ReactNode;
};

function ToastLayout({children}: ToastProps): JSX.Element {
    return (
        <>
            {children}
            <ToastContainer {...(Toaster as ToastContainerProps)} />
        </>
    );
}

export default ToastLayout;