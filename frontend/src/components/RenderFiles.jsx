import React, { useState } from 'react'

const RenderFiles = ({fileUrl}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    if (!fileUrl) return null;
    if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/i)) {
      return (
      <><img
          src={fileUrl}
          alt="Uploaded file"
          className="w-32 h-32 object-cover rounded-md"
          onClick = {openModal}
        />
         {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
            onClick={closeModal}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing on image click
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
                onClick={closeModal}
              >
                &times;
              </button>

              {/* Image */}
              <img
                src={fileUrl}
                alt="Full Screen"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg transform scale-100 transition-transform duration-300 ease-in-out"
              />
            </div>
          </div>
        )}
       </>
      );
    }
    if (fileUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video
          controls
          className="w-48 h-32 object-cover rounded-md"
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  
    if (fileUrl.match(/\.(pdf)$/i)) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View PDF
        </a>
      );
    }
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Download File
      </a>
    )
  
}

export default RenderFiles