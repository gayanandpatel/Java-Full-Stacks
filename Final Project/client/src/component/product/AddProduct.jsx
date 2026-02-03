import { useState } from "react";
import { useDispatch } from "react-redux";
import { Stepper, Step, StepLabel } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { addNewProduct } from "../../store/features/productSlice";


import BrandSelector from "../common/BrandSelector";
import CategorySelector from "../common/CategorySelector";
import ImageUploader from "../common/ImageUploader";


import styles from "./AddProduct.module.css";

const AddProduct = () => {
  const dispatch = useDispatch();
  
 
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [productId, setProductId] = useState(null);

  const steps = ["Product Details", "Upload Images"];

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    inventory: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setProduct({ ...product, category });
    setShowNewCategoryInput(category === "New");
  };

  const handleBrandChange = (brand) => {
    setProduct({ ...product, brand });
    setShowNewBrandInput(brand === "New");
  };

  const handleAddNewProduct = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(addNewProduct(product)).unwrap();
      setProductId(result.id);
      toast.success("Product added successfully!");
      resetForm();
      setActiveStep(1); 
    } catch (error) {
      toast.error(error.message || "Failed to add product");
    }
  };

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      inventory: "",
    });
    setShowNewBrandInput(false);
    setShowNewCategoryInput(false);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <section className={styles.pageContainer}>
      <ToastContainer position="top-center" />
      
      <div className={styles.formCard}>
        <h2 className={styles.title}>Add New Product</h2>
        
        {/* Stepper Navigation */}
        <div className={styles.stepperContainer}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/*Product Details Form */}
        {activeStep === 0 && (
          <form onSubmit={handleAddNewProduct} className={styles.form}>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Product Name</label>
              <input
                className={styles.input}
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Price (₹)</label>
              <input
                className={styles.input}
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="inventory" className={styles.label}>Inventory Count</label>
              <input
                className={styles.input}
                type="number"
                id="inventory"
                name="inventory"
                value={product.inventory}
                onChange={handleChange}
                placeholder="Available stock"
                min="0"
                required
              />
            </div>

            {/* Child components handle their own layout, but fit within our flex column */}
            <BrandSelector
              selectedBrand={product.brand}
              onBrandChange={handleBrandChange}
              showNewBrandInput={showNewBrandInput}
              setShowNewBrandInput={setShowNewBrandInput}
              newBrand={newBrand}
              setNewBrand={setNewBrand}
            />

            <CategorySelector
              selectedCategory={product.category}
              onCategoryChange={handleCategoryChange}
              showNewCategoryInput={showNewCategoryInput}
              setShowNewCategoryInput={setShowNewCategoryInput}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
            />

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product details..."
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Save & Continue to Images
            </button>
          </form>
        )}

        {/* Image Upload */}
        {activeStep === 1 && (
          <div className={styles.stepContainer}>
            <p className={styles.stepTitle}>
              Upload images for your product (ID: {productId})
            </p>
            
            <ImageUploader productId={productId} />
            
            <div className={styles.btnGroup} style={{ justifyContent: 'center', marginTop: '30px' }}>
              <button
                className={styles.prevBtn}
                onClick={handlePreviousStep}
              >
                Back to Details
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AddProduct;