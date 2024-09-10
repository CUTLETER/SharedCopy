package com.project.tobe.repository;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.util.constants.YesNo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface PriceRepository extends JpaRepository<Price, Long>, PriceCustomRepository, QuerydslPredicateExecutor<Price> {
    List<Price> findByActivatedEquals(YesNo c);
}
