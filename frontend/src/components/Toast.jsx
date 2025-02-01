import React, { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
      style={{ zIndex: 9999 }}
    >
      {message}
    </div>
  );
};

export default Toast;
