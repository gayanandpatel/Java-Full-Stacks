// package com.shopifyy.shopifyy.service.chroma;

// import static org.springframework.ai.chroma.vectorstore.ChromaApi.QueryRequest.Include.all;

// import java.util.ArrayList;
// import java.util.List;
// import java.util.Objects;

// import org.springframework.ai.chroma.vectorstore.ChromaApi;
// import org.springframework.ai.chroma.vectorstore.ChromaApi.Collection;
// import org.springframework.ai.chroma.vectorstore.ChromaApi.DeleteEmbeddingsRequest;
// import org.springframework.ai.chroma.vectorstore.ChromaApi.GetEmbeddingsRequest;
// import org.springframework.ai.chroma.vectorstore.ChromaApi.QueryRequest;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;
// import org.springframework.stereotype.Service;

// import com.shopifyy.shopifyy.request.EmbeddingsDeleteRequest;

// import jakarta.persistence.EntityNotFoundException;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;


// @Slf4j
// @Service
// @Component
// @RequiredArgsConstructor
// public class ChromaService implements IChromaService {

//     private final ChromaApi chromaApi;

//     @Value("${spring.ai.vectorstore.chroma.tenant-name}")
//     private String tenantName;

//     @Value("${spring.ai.vectorstore.chroma.database-name}")
//     private String databaseName;


//   /*  @Override
//     public void deleteCollection(String collectionName) {
//         try {
//             chromaApi.deleteCollection(collectionName);
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to delete Chroma collection: " + collectionName, e);
//         }
//     }*/
//     @Override
//     public void deleteCollection(String collectionName) {
//         try {
//             chromaApi.deleteCollection(tenantName, databaseName, collectionName);
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to delete Chroma collection: " + collectionName, e);
//         }
//     }

//  /*   @Override
//     public List<Collection> listCollections() {
//         List<Collection> collections = Objects.requireNonNull(chromaApi.listCollections()).stream().toList();
//         if (collections.isEmpty()) {
//             throw new EntityNotFoundException("No collections found!");
//         }
//         return collections;
//     }*/

//     @Override
//     public List<Collection> listCollections() {
//         List<Collection> collections = Objects.requireNonNull(chromaApi.listCollections(tenantName, databaseName))
//                 .stream().toList();
//         if (collections.isEmpty()) {
//             throw new EntityNotFoundException("No collections found!");
//         }
//         return collections;
//     }

//   /*  @Override
//     public Collection getCollectionById(String collectionName) {
//         Collection collection = chromaApi.getCollection(collectionName);
//         if (collection == null) {
//             throw new EntityNotFoundException("No collection found with name : " + collectionName + " !");
//         }
//         return collection;
//     }*/

//     @Override
//     public Collection getCollectionById(String collectionName) {
//         Collection collection = chromaApi.getCollection(tenantName, databaseName, collectionName);
//         if (collection == null) {
//             throw new EntityNotFoundException("No collection found with name : " + collectionName + " !");
//         }
//         return collection;
//     }

//     @Override
//     public ChromaApi.GetEmbeddingResponse getEmbeddings(String collectionId) {
//         GetEmbeddingsRequest request = new GetEmbeddingsRequest(
//                 null, null, 4, 0, all);
//         return chromaApi.getEmbeddings(tenantName, databaseName, collectionId, request);
//     }

//     @Override
//     public void deleteEmbeddingsByCollectionId(EmbeddingsDeleteRequest request) {
//         // Log high-level info about what we're about to delete
//         log.info("Deleting embeddings for imageId={} in collection={}", request.getImageId(), request.getCollectionName());
//         // Resolve collection UUID (Chroma works with UUID, not human-readable name)
//         String collectionId = getCollectionById(request.getCollectionName()).id();
//         // Step 1: figure out which embedding IDs should be deleted
//         List<String> idsToDelete = findIdsToDelete(collectionId, Long.valueOf(request.getImageId()));
//         // If nothing matched, log and exit gracefully
//         if (idsToDelete.isEmpty()) {
//             log.warn("No embeddings found for imageId={}')", request.getImageId());
//             return;
//         }
//         // Step 2: perform deletion + verification
//         performDelete(collectionId, idsToDelete, Long.valueOf(request.getImageId()));
//     }


//     private List<String> findIdsToDelete(String collectionId, Long imageId) {
//         List<String> idsToDelete = new ArrayList<>();
//         //fetch embeddings directly by their ID (set to imageId as string when saving)
//         var embeddingResponse = fetchEmbeddingsByImageId(collectionId, imageId.toString());
//         if (embeddingResponse != null && !embeddingResponse.ids().isEmpty()) {
//             idsToDelete.addAll(embeddingResponse.ids());
//             log.info("Found embeddings by id: {}", embeddingResponse.ids());
//         }
//         return idsToDelete;
//     }

//     // Fetch embeddings by explicit ID which is the same as the original image ID
//     private ChromaApi.GetEmbeddingResponse fetchEmbeddingsByImageId(String collectionId, String imageId) {
//         GetEmbeddingsRequest request = new GetEmbeddingsRequest(
//                 List.of(imageId), // Look up specific IDs
//                 null,        // No metadata filter
//                 100, 0, QueryRequest.Include.all
//         );
//         return chromaApi.getEmbeddings(tenantName, databaseName, collectionId, request);
//     }


//     private void performDelete(String collectionId, List<String> idsToDelete, Long imageId) {
//         try {
//             // Build the delete request using resolved IDs
//             DeleteEmbeddingsRequest deleteRequest = new DeleteEmbeddingsRequest(idsToDelete, null);
//             log.info("Sending delete request: {}", deleteRequest);
//             // Execute delete against Chroma
//             var deleteResponse = chromaApi.deleteEmbeddings(tenantName, databaseName, collectionId, deleteRequest);
//             log.info("Chroma delete response: {}", deleteResponse);
//         } catch (Exception e) {
//             log.error("Failed deleting embeddings for imageId={} idsToDelete={}", imageId, idsToDelete, e);
//             throw new RuntimeException(e);
//         }
//     }



// }
