package com.zmanager.backendzmanager.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "buckets")
public class Bucket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"buckets"})
    private User user;

    @OneToMany(mappedBy = "bucket",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BucketItem> bucketItems;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<BucketItem> getBucketItems() {
        return bucketItems;
    }

    public void setBucketItems(List<BucketItem> bucketItems) {
        this.bucketItems = bucketItems;
    }

    // Returns only the user_id property of user private variable for all JSON responses
    @JsonProperty("userId")
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }
}
