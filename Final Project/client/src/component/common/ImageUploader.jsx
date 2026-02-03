import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { uploadImages } from "../../store/features/imageSlice";
import { toast } from "react-toastify";
import { BsPlus, BsDash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import styles from "./ImageUploader.module.css";

const ImageUploader = ({ productId }) => {
  const dispatch = useDispatch();
  const fileInputRefs = useRef([]);
  const [images, setImages] = useState([]);
  const [imageInputs, setImageInputs] = useState([{ id: nanoid() }]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    
    const newImages = files
      .filter((file) => file.name)
      .map((file) => ({
        id: nanoid(),
        name: file.name,
        file,
      }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleAddImageInput = (e) => {
    e.preventDefault();
    setImageInputs((prevInputs) => [...prevInputs, { id: nanoid() }]);
  };

  const handleRemoveImageInput = (id) => {
    setImageInputs(imageInputs.filter((input) => input.id !== id));
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Product ID is missing. Please save the product details first.");
      return;
    }

    
    const validFiles = images
      .map((img) => img.file)
      .filter((file) => file instanceof File);

    if (validFiles.length > 0) {
      try {
        const result = await dispatch(
          uploadImages({
            productId,
            files: validFiles,
          })
        ).unwrap();

        
        clearFileInputs();
        setImages([]);
        setImageInputs([{ id: nanoid() }]);
        toast.success(result.message || "Images uploaded successfully!");
      } catch (error) {
        console.error("Upload error details:", error);
        toast.error(typeof error === "string" ? error : "Failed to upload images.");
      }
    } else {
      toast.warning("Please select at least one valid image file.");
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
              {imageInputs.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveImageInput(input.id)}
                  title="Remove this input"
                >
                  <BsDash className={styles.icon} />
                </button>
              )}
            </div>
          ))}
        </div>

        {images.length > 0 && (
          <div
            style={{
              marginBottom: "15px",
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            {images.length} file(s) selected
          </div>
        )}

        <button type="submit" className={styles.uploadBtn}>
          Upload Images
        </button>
      </form>
    </div>
  );
};

ImageUploader.propTypes = {
  productId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default ImageUploader;