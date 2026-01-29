// package com.shopifyy.shopifyy.service.embeddings;

// import java.io.IOException;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;
// import org.springframework.ai.document.Document;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// public class ImageSearchService {
//     private final ChromaVectorStore vectorStore;
//     private final LLMServiceUtil llmServiceUtil;


//     // This method can be used for direct image embeddings
//     // New update: The image ID was added to the metadata to enable us to manipulate the embeddings easily
//     public List<String> saveEmbeddings(MultipartFile image, Long productId, Long imageId) throws IOException {
//         String imageDescription = llmServiceUtil.descriptionImage(image);
//         Map<String, Object> metadata = new HashMap<>();
//         metadata.put("productId", productId);
//         metadata.put("imageId", imageId.toString());
//         metadata.put("documentId", UUID.randomUUID().toString());
//         var doc = Document.builder()
//                 .id(imageId.toString())
//                 .text(imageDescription)
//                 .metadata(metadata)
//                 .build();
//         try {
//             vectorStore.doAdd(List.of(doc));
//         } catch (Exception e) {
//             throw new RuntimeException(e);
//         }
//         return List.of("Successfully added to vector store");
//     }

//     public List<Long> searchImageSimilarity(MultipartFile queryImage) throws IOException {
//         String imageDescription = llmServiceUtil.descriptionImage(queryImage);
//         SearchRequest searchRequest = SearchRequest.builder()
//                 .query(imageDescription)
//                 .topK(10)
//                 .similarityThreshold(0.85f)
//                 .build();
//         List<Document> searchResult = vectorStore.doSimilaritySearch(searchRequest);
//         log.info("Search result: {}", searchResult);
//         searchResult.forEach(doc -> {
//             Double score = doc.getScore();
//             Object productId = doc.getMetadata().get("productId");
//             log.info("Found doc with productId: {}, similarity score: {}", productId, score);
//         });
//         return searchResult.stream()
//                 .map(doc -> doc.getMetadata().get("productId"))
//                 .filter(Objects::nonNull)
//                 .map(Object::toString)
//                 .map(Long::valueOf)
//                 .collect(Collectors.toList());
//     }
// }

