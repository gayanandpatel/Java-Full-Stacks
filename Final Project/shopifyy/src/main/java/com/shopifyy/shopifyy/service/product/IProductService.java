package com.shopifyy.shopifyy.service.product;

import java.util.List;

import com.shopifyy.shopifyy.dtos.ProductDto;
import com.shopifyy.shopifyy.model.Product;
import com.shopifyy.shopifyy.request.AddProductRequest;
import com.shopifyy.shopifyy.request.ProductUpdateRequest;

public interface IProductService {
    Product addProduct(AddProductRequest product);

    Product updateProduct(ProductUpdateRequest product, Long productId);

    Product getProductById(Long productId);

    void deleteProductById(Long productId);

    List<Product> getAllProducts();

    List<Product> getProductsByCategoryAndBrand(String category, String brand);

    List<Product> getProductsByCategory(String category);

    List<Product> getProductsByBrandAndName(String brand, String name);

    List<Product> getProductsByBrand(String brand);

    List<Product> getProductsByName(String name);

    List<Product> findDistinctProductsByName();

    List<String> getAllDistinctBrands();

    List<ProductDto> getConvertedProducts(List<Product> products);

    ProductDto convertToDto(Product product);

    List<Product> getProductsByCategoryId(Long categoryId);
}



