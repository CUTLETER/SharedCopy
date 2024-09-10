package com.project.tobe.repository;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.entity.QPrice;
import com.project.tobe.util.constants.YesNo;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.project.tobe.util.constants.YesNo.*;

public class PriceRepositoryImpl implements PriceCustomRepository {
    @PersistenceContext
    private EntityManager entityManager;

    private final JPAQueryFactory jpaQueryFactory;

    public PriceRepositoryImpl(EntityManager entityManager) {
        this.jpaQueryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public List<Price> getPriceByDTO(PriceSearchDTO dto) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;

        Optional<LocalDate> registerDate = Optional.ofNullable(dto.getRegisterDate());
        Optional<String> productNo = Optional.ofNullable(dto.getProductNo());
        Optional<String> customerNo = Optional.ofNullable(dto.getCustomerNo());
        Optional<LocalDate> startDate = Optional.ofNullable(dto.getStartDate());
        Optional<LocalDate> endDate = Optional.ofNullable(dto.getEndDate());

        registerDate.ifPresent(localDate -> builder.and(price.registerDate.eq(localDate)));
        productNo.filter(s-> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.productNo.eq(Long.parseLong(s))));
        customerNo.filter(s-> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.customerNo.eq(Long.parseLong(s))));
        startDate.ifPresent(localDate -> builder.and(price.startDate.after(localDate)));
        endDate.ifPresent(localDate -> builder.and(price.endDate.before(localDate)));
        builder.and(price.activated.eq(Y));

        return jpaQueryFactory.select(price).from(price).where(builder).orderBy(price.priceNo.desc()).fetch();
    }
}
