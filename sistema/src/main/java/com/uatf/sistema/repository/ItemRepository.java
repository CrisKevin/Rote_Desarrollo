package com.uatf.sistema.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.Item;

public interface ItemRepository extends JpaRepository<Item, UUID> {
}
