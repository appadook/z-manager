package com.zmanager.backendzmanager.controller;

import com.zmanager.backendzmanager.model.Bucket;
import com.zmanager.backendzmanager.model.User;
import com.zmanager.backendzmanager.repository.BucketRepository;
import com.zmanager.backendzmanager.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/{userId}/buckets")
public class BucketController {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private BucketRepository bucketRepository;

    // Endpoint to add a new bucket for a specific user
    @PostMapping
    public ResponseEntity<Bucket> createBucket(@PathVariable Long userId, @RequestBody Bucket bucket) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User user = optionalUser.get();
        bucket.setUser(user);
        Bucket savedBucket = bucketRepository.save(bucket);
        return ResponseEntity.ok(savedBucket);
    }

    // Endpoint to get all buckets for a specific user
    @GetMapping
    public ResponseEntity<List<Bucket>> getBucketsForUser(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(optionalUser.get().getBuckets());
    }

    @PutMapping("/{bucketId}")
    public ResponseEntity<Bucket> updateBucket(
            @PathVariable Long userId,
            @PathVariable Long bucketId,
            @RequestBody Bucket bucketDetails) {
        Optional<Bucket> optionalBucket = bucketRepository.findById(bucketId);
        if (!optionalBucket.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Bucket bucket = optionalBucket.get();

        // Ensure the bucket belongs to the user
        if (!bucket.getUser().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }

        bucket.setName(bucketDetails.getName());
        Bucket updatedBucket = bucketRepository.save(bucket);

        return ResponseEntity.ok(updatedBucket);
    }

    // Endpoint to delete a bucket for a specific user
    @DeleteMapping("/{bucketId}")
    public ResponseEntity<Void> deleteBucket(
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

        bucketRepository.delete(bucket);

        return ResponseEntity.noContent().build();
    }

}

