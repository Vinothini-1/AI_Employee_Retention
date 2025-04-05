import React from "react";
import { ScaleLoader } from "react-spinners";

const MyScaleLoader = () => {
  return (
    <>
      <ScaleLoader
        color="#B72A63"
        cssOverride={{}}
        height={50}
        loading
        margin={3}
        radius={6}
        speedMultiplier={1}
        width={11}
      />
    </>
  );
};

export default MyScaleLoader;
