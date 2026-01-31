import React, { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { uploadImages } from "../../store/features/imageSlice";
import { toast } from "react-toastify";
import { BsPlus, BsDash } from "react-icons/bs";
import { useDispatch } from "react-redux";

// Import styles
import styles from "./ImageUploader.module.css";

const ImageUploader = ({ productId }) => {
  const dispatch = useDispatch();
  const fileInputRefs = useRef([]);

  const [images, setImages] = useState([]);
  const [imageInputs, setImageInputs] = useState([{ id: nanoid() }]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: nanoid(),
      name: file.name,
      file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleAddImageInput = (e) => {
    e.preventDefault(); // Prevent any form submission or link jump
    setImageInputs((prevInputs) => [...prevInputs, { id: nanoid() }]);
  };

  const handleRemoveImageInput = (id) => {
    setImageInputs(imageInputs.filter((input) => input.id !== id));
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }
    
    // Check if we actually have files selected
    if (Array.isArray(images) && images.length > 0) {
      try {
        const result = await dispatch(
          uploadImages({ 
            productId, 
            files: images.map((image) => image.file) 
          })
        ).unwrap();
        
        clearFileInputs();
        setImages([]); // Clear local state of files
        setImageInputs([{ id: nanoid() }]); // Reset to single input
        toast.success(result.message || "Images uploaded successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to upload images");
      }
    } else {
      toast.warning("Please select at least one image.");
    }
  };

  const clearFileInputs = () => {
    fileInputRefs.current.forEach((input) => {
      if (input) input.value = null;
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleImageUpload}>
        
        <div className={styles.header}>
          <h5 className={styles.title}>Product Images</h5>
          <button 
            type="button" 
            onClick={handleAddImageInput} 
            className={styles.addMoreBtn}
          >
            <BsPlus className={styles.icon} /> Add More
          </button>
        </div>

        <div className={styles.inputList}>
          {imageInputs.map((input, index) => (
            <div key={input.id} className={styles.inputGroup}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                ref={(el) => (fileInputRefs.current[index] = el)}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemoveImageInput(input.id)}
                title="Remove this input"
              >
                <BsDash className={styles.icon} />
              </button>
            </div>
          ))}
        </div>

        {imageInputs.length > 0 && (
          <button type="submit" className={styles.uploadBtn}>
            Upload Images
          </button>
        )}
      </form>
    </div>
  );
};

export default ImageUploader;