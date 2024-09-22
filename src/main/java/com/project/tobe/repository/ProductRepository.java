package com.project.tobe.repository;

import com.project.tobe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByProductYnEquals(Character productYn);

    @Query("SELECT p FROM Product p ORDER BY p.productNo DESC")
    List<Product> findAllByOrderByProductNoDesc();

    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.productYn = 'N' WHERE p.productNo IN :productNos")
    void updateProductYn(@Param("productNos") List<Long> productNos);
}
