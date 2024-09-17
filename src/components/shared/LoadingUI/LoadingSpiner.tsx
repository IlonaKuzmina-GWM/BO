import React from 'react';
import styles from './loadingSpiner.module.css';

export const LoadingSpiner = () => {
    return (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30">
            <div className=" border py-2 px-5 border-accentLight flex items-center flex-col backdrop-blur-md rounded-[30px]">
                <div className={`${styles.loaderDots} block relative w-20 h-5 mt-2`}>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-accentLight"></div>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-accentLight"></div>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-accentLight"></div>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-accentLight"></div>
                </div>
                <div className="text-gray-500 text-xs font-light mt-2 text-center">
                    Please wait...
                </div>
            </div>
        </div>
    )
}
