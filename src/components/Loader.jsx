import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/JSON/loading.json"; // ✅ Make sure this path is correct

const Loader = () => {
  return (
    <div className="fixed font-[montserrat] inset-0 z-50 flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm">
      <div className="w-[300px] h-[300px]">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }} // ✅ Ensures proper scaling
        />
      </div>
      <p className="mt-4 font-[montserrat] text-blue-600 font-semibold text-sm tracking-wide">
        Launching the app...
      </p>
    </div>
  );
};

export default Loader;
