import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-[9999] opacity-50">
      <div className="w-20 h-20 border-4 border-solid border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
