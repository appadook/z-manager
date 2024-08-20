package com.zmanager.backendzmanager.controller;

import com.zmanager.backendzmanager.model.Bucket;
import com.zmanager.backendzmanager.model.BucketItem;
import com.zmanager.backendzmanager.model.User;
import com.zmanager.backendzmanager.repository.BucketItemRepository;
import com.zmanager.backendzmanager.repository.BucketRepository;
import com.zmanager.backendzmanager.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/{userId}/buckets/{bucketId}/items")
public class BucketItemController {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private BucketRepository bucketRepository;

    @Autowired
    private BucketItemRepository bucketItemRepository;

    // Endpoint to add a new bucket item for a specific bucket and user
    @PostMapping
    public ResponseEntity<BucketItem> createBucketItem(
            @PathVariable Long userId,
            @PathVariable Long bucketId,
            @RequestBody BucketItem bucketItem) {

        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Bucket> optionalBucket = bucketRepository.findById(bucketId);
        if (!optionalBucket.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        Bucket bucket = optionalBucket.get();

        // Ensure the bucket belongs to the user
        if (!bucket.getUser().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().build();
        }

        bucketItem.setUser(user);
        bucketItem.setBucket(bucket);
        BucketItem savedBucketItem = bucketItemRepository.save(bucketItem);

        return ResponseEntity.ok(savedBucketItem);
    }

    // Endpoint to get all items for a specific bucket
    @GetMapping
    public ResponseEntity<List<BucketItem>> getBucketItemsForBucket(
            @PathVariable Long userId,
            @PathVariable Long bucketId) {

        Optional<Bucket> optionalBucket = bucketRepository.findById(bucketId);
        if (!optionalBucket.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Bucket bucket = optionalBucket.get();

        // Ensure the bucket belongs to the user
        if (!bucket.getUser().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(bucket.getBucketItems());
    }


    @PutMapping("/{itemId}")
    public ResponseEntity<BucketItem> updateBucketItem(
            @PathVariable Long userId,
            @PathVariable Long bucketId,
            @PathVariable Long itemId,
            @RequestBody BucketItem itemDetails) {

        Optional<BucketItem> optionalBucketItem = bucketItemRepository.findById(itemId);
        if (!optionalBucketItem.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        BucketItem bucketItem = optionalBucketItem.get();

        // Ensure the bucket item belongs to the correct bucket and user
        if (!Objects.equals(bucketItem.getBucket().getId(), bucketId) || !bucketItem.getUser().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }

        bucketItem.setName(itemDetails.getName());
//        bucketItem.setDescription(itemDetails.getDescription());
        BucketItem updatedBucketItem = bucketItemRepository.save(bucketItem);

        return ResponseEntity.ok(updatedBucketItem);
    }

}

