import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api";

export const uploadImages = createAsyncThunk(
  "image/uploadImages",
  async ({ productId, files }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      if (Array.isArray(files)) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      } else {
        formData.append("files", files);
      }
      const response = await api.post(
        `/images/upload?productId=${productId}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to upload images"
      );
    }
  }
);

// Update Product Image
export const updateProductImage = createAsyncThunk(
  "image/updateProductImage",
  async ({ imageId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await api.put(
        `/images/image/${imageId}/update`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update image"
      );
    }
  }
);

// Delete Product Image
export const deleteProductImage = createAsyncThunk(
  "image/deleteProductImage",
  async ({ imageId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/images/image/${imageId}/delete`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete image"
      );
    }
  }
);


const initialState = {
  uploadedImages: [], 
  isLoading: false,
  error: null,
  successMessage: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    clearImageError: (state) => {
      state.error = null;
    },
    clearImageSuccess: (state) => {
      state.successMessage = null;
    },
    resetImageState: (state) => {
      state.uploadedImages = [];
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload Images
      .addCase(uploadImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.isLoading = false;
        const newImages = Array.isArray(action.payload.data) 
          ? action.payload.data 
          : [action.payload.data];
          
        state.uploadedImages = [...state.uploadedImages, ...newImages];
        state.successMessage = "Images uploaded successfully";
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Product Image
      .addCase(updateProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadedImages = state.uploadedImages.map(img => 
             img.id === action.payload.data.id ? action.payload.data : img
        );
        state.successMessage = "Image updated successfully";
      })
      .addCase(updateProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Product Image
      .addCase(deleteProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || "Image deleted successfully";
        const deletedId = action.meta.arg.imageId;
        state.uploadedImages = state.uploadedImages.filter(img => img.id !== deletedId);
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImageError, clearImageSuccess, resetImageState } = imageSlice.actions;

export default imageSlice.reducer;