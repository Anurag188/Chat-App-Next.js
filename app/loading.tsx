import { momentum } from 'ldrs'


export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <div className="w-screen h-screen gap-x-2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black animate-[custom_0.5s_ease-in-out_infinite] delay-100"></div>
                <div className="w-4 h-4 rounded-full bg-black animate-[custom_0.5s_ease-in-out_infinite] delay-200 "></div>
                <div className="w-4 h-4 rounded-full bg-black animate-[custom_0.5s_ease-in-out_infinite] delay-300 "></div>
            </div>

        </>
    )
}   