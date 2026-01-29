package com.shopifyy.shopifyy.request;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class EmbeddingsDeleteRequest {
    private String collectionName;
    private String imageId;
}
