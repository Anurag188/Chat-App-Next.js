const Loading = () => {
    return ( 
        <>
                <div className="w-full h-full gap-x-2 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black animate-[custom_0.5s_ease-in-out_infinite] delay-100"></div>
                    <div className="w-3 h-3 rounded-full bg-black animate-[custom_0.5s_ease-in-out_infinite] delay-200"></div>
                    <div className="w-3 h-3 rounded-full bg-black animate-[custom_0.5s_ease-in-out_infinite] delay-300"></div>
                </div>

            </>        
     );
}
 
export default Loading;
