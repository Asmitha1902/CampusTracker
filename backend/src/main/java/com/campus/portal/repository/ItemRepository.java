package com.campus.portal.repository;

import com.campus.portal.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findAllByOrderByIdDesc();
 List<Item> findByStatusIgnoreCase(String status);
List<Item> findByUser_Id(Long userId);
int countByUserId(Long userId);
}