// package com.shopifyy.shopifyy.controller;

// import java.util.List;

// import org.springframework.ai.chroma.vectorstore.ChromaApi.Collection;
// import org.springframework.ai.chroma.vectorstore.ChromaApi.GetEmbeddingResponse;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.shopifyy.shopifyy.request.EmbeddingsDeleteRequest;
// import com.shopifyy.shopifyy.response.ApiResponse;
// import com.shopifyy.shopifyy.service.chroma.ChromaService;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Slf4j
// @RestController
// @RequiredArgsConstructor
// @RequestMapping("${api.prefix}/chroma")
// public class ChromaController {

//     private final ChromaService chromaService;

//     @GetMapping("/collections")
//     public ResponseEntity<ApiResponse> listCollections() {
//         List<Collection> collections = chromaService.listCollections();
//         return ResponseEntity.ok(new ApiResponse("collections", collections));
//     }

//     @GetMapping("/collection")
//     public ResponseEntity<ApiResponse> getCollection(String collectionName) {
//         Collection collection = chromaService.getCollectionById(collectionName);
//         return ResponseEntity.ok(new ApiResponse("collections", collection));
//     }

//     @DeleteMapping("/collections/{collectionName}/delete")
//     public ResponseEntity<ApiResponse> deleteCollection(@PathVariable String collectionName) {
//         chromaService.deleteCollection(collectionName);
//         return ResponseEntity.ok(new ApiResponse("Collection deleted!", collectionName+ " was successfully deleted"));
//     }

//     @DeleteMapping("/collection/embeddings/delete")
//     public ResponseEntity<ApiResponse> deleteEmbeddings(@RequestBody EmbeddingsDeleteRequest request) {
//        chromaService.deleteEmbeddingsByCollectionId(request);
//         return ResponseEntity.ok(new ApiResponse("Embeddings deleted successfully!", null));
//     }

//     @GetMapping("/collection/{collectionId}/embeddings")
//     public ResponseEntity<ApiResponse> getEmbeddings(@PathVariable String collectionId) {
//        GetEmbeddingResponse embeddings = chromaService.getEmbeddings(collectionId);
//        log.info("embeddings: {}", embeddings);
//         return ResponseEntity.ok(new ApiResponse("Embeddings Found!", embeddings));
//     }

// }