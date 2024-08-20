package com.zmanager.backendzmanager.repository;

import com.zmanager.backendzmanager.model.Bucket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BucketRepository extends JpaRepository<Bucket, Long> {
}
