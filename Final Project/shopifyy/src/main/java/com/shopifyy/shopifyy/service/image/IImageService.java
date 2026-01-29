package com.shopifyy.shopifyy.service.image;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.shopifyy.shopifyy.dtos.ImageDto;
import com.shopifyy.shopifyy.model.Image;

public interface IImageService {
    Image getImageById(Long imageId);
    void deleteImageById(Long imageId);
    void updateImage(MultipartFile file, Long imageId);
    List<ImageDto> saveImages(Long productId, List<MultipartFile> files);

}
