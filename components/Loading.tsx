const Loading = () => {
    return ( 
        <>
                <div className="w-full h-full gap-x-2 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-black animate-[bounce_0.6s_ease-in-out_infinite]"></div>
                    <div className="w-3 h-3 rounded-full bg-black animate-[bounce_0.7s_ease-in-out_infinite]"></div>
                </div>

            </>        
     );
}
 
export default Loading;
