import React from "react";

const Fallback: React.FC = () => {
  return (
    <div className="flex h-svh justify-center bg-neutral-200 items-center">
      <div className="card">
        <div className="loader">
          loading
          <div className="words">
            <div className="word">website</div>
            <div className="word">data</div>
            <div className="word">resources</div>
            <div className="word">content</div>
            <div className="word">website</div>
          </div>
          <span className="font-bold">.</span>
        </div>
      </div>
    </div>
  );
};

export default Fallback;
