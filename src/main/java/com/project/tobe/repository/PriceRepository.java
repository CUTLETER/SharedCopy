package com.project.tobe.repository;

import com.project.tobe.entity.Price;
import com.project.tobe.util.constants.YesNo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PriceRepository extends JpaRepository<Price, Long>, PriceCustomRepository, QuerydslPredicateExecutor<Price> {
    List<Price> findByActivatedEquals(YesNo c);
}
