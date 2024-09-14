package com.project.tobe.repository;

import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.entity.QCustomer;
import com.project.tobe.entity.QPrice;
import com.project.tobe.entity.QProduct;
import com.project.tobe.util.constants.YesNo;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPADeleteClause;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.project.tobe.util.constants.YesNo.*;

public class PriceCustomRepositoryImpl implements PriceCustomRepository {
    @PersistenceContext
    private EntityManager entityManager;

    private final JPAQueryFactory jpaQueryFactory;

    public PriceCustomRepositoryImpl(EntityManager entityManager) {
        this.jpaQueryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public List<Price> getPriceByDTO(PriceDTO dto) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;

//        Optional<LocalDate> registerDate = Optional.ofNullable(dto.getRegisterDate());
//        Optional<String> productNo = Optional.ofNullable(dto.getProductNo());
//        Optional<String> customerNo = Optional.ofNullable(dto.getCustomerNo());
//        Optional<LocalDate> startDate = Optional.ofNullable(dto.getStartDate());
//        Optional<LocalDate> endDate = Optional.ofNullable(dto.getEndDate());
//
//        registerDate.ifPresent(localDate -> builder.and(price.registerDate.eq(localDate)));
//        productNo.filter(s-> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.product.productNo.eq(Long.parseLong(s))));
//        customerNo.filter(s-> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.customer.customerNo.eq(Long.parseLong(s))));
//        startDate.ifPresent(localDate -> builder.and(price.startDate.after(localDate)));
//        endDate.ifPresent(localDate -> builder.and(price.endDate.before(localDate)));
//        builder.and(price.activated.eq(Y));


        return jpaQueryFactory.select(price).from(price).where(builder).orderBy(price.priceNo.desc()).fetch();
    }

    @Override
    public List<PriceProductCustomerDTO> getPriceJoinByDTO(PriceDTO dto) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;
        QProduct product = QProduct.product;
        QCustomer customer = QCustomer.customer;

        Optional<LocalDate> registerDate = Optional.ofNullable(dto.getRegisterDate());
        Optional<String> productNo = Optional.ofNullable(dto.getProductNo());
        Optional<String> customerNo = Optional.ofNullable(dto.getCustomerNo());
        Optional<LocalDate> startDate = Optional.ofNullable(dto.getStartDate());
        Optional<LocalDate> endDate = Optional.ofNullable(dto.getEndDate());

        registerDate.ifPresent(localDate -> builder.and(price.registerDate.eq(localDate)));
        productNo.filter(s-> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.product.productNo.eq(Long.parseLong(s))));
        customerNo.filter(s-> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.customer.customerNo.eq(Long.parseLong(s))));
        startDate.ifPresent(localDate -> builder.and(price.startDate.after(localDate)));
        endDate.ifPresent(localDate -> builder.and(price.endDate.before(localDate)));
        builder.and(price.activated.eq(Y));

        return jpaQueryFactory
                .select(
                        Projections.constructor(
                                PriceProductCustomerDTO.class,
                                price.registerDate,
                                price.priceNo,
                                product.productNo,
                                product.productName,
                                customer.customerNo,
                                customer.customerName,
                                price.customPrice,
                                price.currency,
                                price.discount,
                                price.startDate,
                                price.endDate
                        )
                )
                .from(price)
                .join(price.product, product)
                .join(price.customer, customer)
                .where(price.product.productYn.eq('Y'))
                .where(price.customer.activated.eq("Y"))
                .where(builder)
                .orderBy(price.priceNo.desc())
                .fetch();
    }

    @Override
    @Transactional
    public void updatePrice(PriceDTO dto) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;
        builder.and(price.priceNo.eq(dto.getPriceNo()));

        JPAUpdateClause updateQuery = jpaQueryFactory.update(price).where(builder);

        // 각 필드가 null이 아닐 때만 업데이트 조건을 추가합니다.
        Optional.ofNullable(dto.getStartDate()).ifPresent(startDate ->
                updateQuery.set(price.startDate, startDate)
        );
        Optional.ofNullable(dto.getEndDate()).ifPresent(endDate ->
                updateQuery.set(price.endDate, endDate)
        );
        Optional.ofNullable(dto.getCustomPrice()).ifPresent(customPrice ->
                updateQuery.set(price.customPrice, customPrice)
        );
        Optional.ofNullable(dto.getDiscount()).ifPresent(discount ->
                updateQuery.set(price.discount, discount)
        );
        Optional.ofNullable(dto.getCurrency()).ifPresent(currency ->
                updateQuery.set(price.currency, currency)
        );

        updateQuery.execute();
    }

    @Override
    @Transactional
    public void updateOldPrice(Price entity) {
        QPrice price = QPrice.price;

        // 1. 삭제: 엔티티의 시작일보다 큰 시작일, 엔티티의 종료일보다 작은 종료일 가진 데이터
        deletePricesWithDateRange(price, entity);

        // 2. 업데이트: 엔티티의 시작일과 종료일 사이에 있는 데이터들
        updateStartDateInRange(price, entity);
        updateEndDateInRange(price, entity);
        deleteStartDateBiggerEndDate(price);
    }

    private void deletePricesWithDateRange(QPrice price, Price entity) {
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(price.priceNo.ne(entity.getPriceNo()));
        builder.and(price.customer.customerNo.eq(entity.getCustomer().getCustomerNo()));
        builder.and(price.product.productNo.eq(entity.getProduct().getProductNo()));
        builder.and(price.startDate.goe(entity.getStartDate()));
        builder.and(price.endDate.loe(entity.getEndDate()));

        new JPAUpdateClause(entityManager, price)
                .where(builder)
                .set(price.activated, N)
                .execute();
    }

    private void updateStartDateInRange(QPrice price, Price entity) {
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(price.priceNo.ne(entity.getPriceNo()));
        builder.and(price.customer.customerNo.eq(entity.getCustomer().getCustomerNo()));
        builder.and(price.product.productNo.eq(entity.getProduct().getProductNo()));
        builder.and(price.startDate.between(entity.getStartDate(), entity.getEndDate()));

        new JPAUpdateClause(entityManager, price)
                .where(builder)
                .set(price.startDate, entity.getEndDate().plusDays(1))
                .execute();
    }

    private void updateEndDateInRange(QPrice price, Price entity) {
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(price.priceNo.ne(entity.getPriceNo()));
        builder.and(price.customer.customerNo.eq(entity.getCustomer().getCustomerNo()));
        builder.and(price.product.productNo.eq(entity.getProduct().getProductNo()));
        builder.and(price.endDate.between(entity.getStartDate(), entity.getEndDate()));

        new JPAUpdateClause(entityManager, price)
                .where(builder)
                .set(price.endDate, entity.getStartDate().minusDays(1))
                .execute();
    }

    private void deleteStartDateBiggerEndDate(QPrice price) {
        BooleanExpression deleteCondition = price.startDate.goe(price.endDate);

        new JPAUpdateClause(entityManager, price)
                .where(deleteCondition)
                .set(price.activated, N)
                .execute();
    }
}