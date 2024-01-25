import { momentum } from 'ldrs'


export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <div className="w-screen h-screen gap-x-2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-black animate-[bounce_0.6s_ease-in-out_infinite]"></div>
                <div className="w-4 h-4 rounded-full bg-black animate-[bounce_0.7s_ease-in-out_infinite]"></div>
            </div>

        </>
    )
}   