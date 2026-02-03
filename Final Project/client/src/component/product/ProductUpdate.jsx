import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import {
  getProductById,
  updateProduct,
} from "../../store/features/productSlice";
import { deleteProductImage } from "../../store/features/imageSlice";

import LoadSpinner from "../common/LoadSpinner";
import BrandSelector from "../common/BrandSelector";
import CategorySelector from "../common/CategorySelector";
import ProductImage from "../utils/ProductImage";
import ImageUpdater from "../image/ImageUpdater";

import styles from "./ProductUpdate.module.css";

const ProductUpdate = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const newProductImage = useSelector((state) => state.image.uploadedImages);

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    brand: "",
    price: "",
    inventory: "",
    description: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(getProductById(productId)).unwrap();
        setUpdatedProduct(result);
      } catch (error) {
        toast.error(error.message || "Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [dispatch, productId, newProductImage]);

  const handleChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleBrandChange = (brand) => {
    setUpdatedProduct({ ...updatedProduct, brand });
    setShowNewBrandInput(brand === "New");
  };

  const handleCategoryChange = (category) => {
    setUpdatedProduct({ ...updatedProduct, category });
    setShowNewCategoryInput(category === "New");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        updateProduct({ productId, updatedProduct })
      ).unwrap();
      toast.success(result.message || "Product updated successfully");
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if(!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const result = await dispatch(deleteProductImage({ imageId })).unwrap();
      toast.success(result.message);

      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        images: prevProduct.images.filter((image) => image.id !== imageId),
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditImage = (imageId) => {
    setSelectedImageId(imageId);
    setShowImageModal(true);
  };

  const handleAddImage = () => {
    setShowImageModal(true);
    setSelectedImageId(null);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImageId(null);
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />
      
      <div className={styles.header}>
        <h2 className={styles.title}>Update Product</h2>
      </div>

      <div className={styles.layoutGrid}>
        
        {/* --- LEFT: Product Form --- */}
        <div className={styles.formSection}>
          <form onSubmit={handleUpdateProduct}>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Product Name</label>
              <input
                className={styles.input}
                type="text"
                id="name"
                name="name"
                value={updatedProduct.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Price (₹)</label>
              <input
                type="number"
                className={styles.input}
                name="price"
                value={updatedProduct.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="inventory" className={styles.label}>Inventory Stock</label>
              <input
                type="number"
                className={styles.input}
                name="inventory"
                value={updatedProduct.inventory}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <BrandSelector
                selectedBrand={updatedProduct.brand}
                onBrandChange={handleBrandChange}
                showNewBrandInput={showNewBrandInput}
                setShowNewBrandInput={setShowNewBrandInput}
                newBrand={newBrand}
                setNewBrand={setNewBrand}
              />
            </div>

            <div className={styles.formGroup}>
              <CategorySelector
                selectedCategory={updatedProduct.category?.name || ""} 
                onCategoryChange={handleCategoryChange}
                showNewCategoryInput={showNewCategoryInput}
                setShowNewCategoryInput={setShowNewCategoryInput}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                name="description"
                value={updatedProduct.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Save Changes
            </button>
          </form>
        </div>

        {/* --- RIGHT: Image Manager --- */}
        <div className={styles.imageSection}>
          <h4 className={styles.sectionTitle}>Product Images</h4>
          
          <div className={styles.imageList}>
            {updatedProduct.images && updatedProduct.images.length > 0 ? (
              updatedProduct.images.map((image, index) => (
                <div key={index} className={styles.imageCard}>
                  <div className={styles.imageWrapper}>
                    <ProductImage productId={image.id} />
                  </div>
                  
                  <div className={styles.imageActions}>
                    <button 
                      type="button" 
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => handleEditImage(image.id)}
                    >
                      <FaEdit /> Edit
                    </button>
                    
                    <button 
                      type="button" 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center py-4">No images uploaded yet.</p>
            )}
          </div>

          <button 
            type="button" 
            className={styles.addImageBtn} 
            onClick={handleAddImage}
          >
            <FaPlus style={{marginRight: '5px'}}/> Add New Image
          </button>
        </div>
      </div>

      <ImageUpdater
        show={showImageModal}
        handleClose={handleCloseImageModal}
        selectedImageId={selectedImageId}
        productId={productId}
      />
    </div>
  );
};

export default ProductUpdate;