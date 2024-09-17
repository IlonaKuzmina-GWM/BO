import React from 'react'

const LoadingCoinsSkeleton = () => {
    return (
        <div className="">
            <div className="animate-pulse bg-[#2e2e2e] rounded-[8px] border-[1px] border-borderLight p-4 mb-[1px]">
                <div  className="w-[40px] h-[40px] bg-black animate-pulse rounded-full"></div>
            </div>
        </div>
    )
}

export default LoadingCoinsSkeleton