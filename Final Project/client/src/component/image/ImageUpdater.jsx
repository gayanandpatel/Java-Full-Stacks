import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  uploadImages,
  updateProductImage,
} from "../../store/features/imageSlice";


import styles from "./ImageUpdater.module.css";

const ImageUpdater = ({
  show,
  handleClose,
  selectedImageId,
  productId,
  selectedImage,
}) => {
  const fileInputRef = useRef(null);

ImageUpdater.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedImageId: PropTypes.string,
  productId: PropTypes.string.isRequired,
  selectedImage: PropTypes.object,
};
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (show) {
      // Reset state when modal opens
      if (selectedImage) {
        setImagePreview(selectedImage.imageUrl);
      } else {
        setImagePreview(null);
      }
      setSelectedFile(null);
    }
  }, [show, selectedImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageAction = async () => {
    if (!selectedFile) {
      toast.warn("Please select an image first.");
      return;
    }
    
    try {
      let result;
      if (selectedImageId) {
        result = await dispatch(
          updateProductImage({ imageId: selectedImageId, file: selectedFile })
        ).unwrap();
      } else {
        result = await dispatch(
          uploadImages({ productId, files: [selectedFile] })
        ).unwrap();
      }
      toast.success(result.message || "Operation successful");
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    }
  };

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            {selectedImageId ? "Update Product Image" : "Add Product Image"}
          </h3>
          <button className={styles.closeBtn} onClick={handleClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.instruction}>
            {selectedImageId
              ? "Select a new image to replace the current one:"
              : "Select a new image to upload:"}
          </p>
          
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className={styles.previewContainer}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.previewImage}
              />
            ) : (
              <span className={styles.placeholderText}>No image selected</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={handleClose}>
            Cancel
          </button>
          <button className={`${styles.btn} ${styles.actionBtn}`} onClick={handleImageAction}>
            {selectedImageId ? "Save Changes" : "Upload Image"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImageUpdater;