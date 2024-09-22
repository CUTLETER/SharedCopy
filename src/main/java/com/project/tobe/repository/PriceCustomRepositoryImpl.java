package com.project.tobe.repository;

import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.*;
import com.project.tobe.util.constants.YesNo;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPADeleteClause;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public Page<PriceProductCustomerDTO> getPriceJoinByDTO(PriceDTO dto, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;
        QProduct product = QProduct.product;
        QCustomer customer = QCustomer.customer;

        Optional<LocalDateTime> registerDate = Optional.ofNullable(dto.getRegisterDate());
        Optional<String> productName = Optional.ofNullable(dto.getProductName());
        Optional<String> customerName = Optional.ofNullable(dto.getCustomerName());
        Optional<LocalDate> startDate = Optional.ofNullable(dto.getStartDate());
        Optional<LocalDate> endDate = Optional.ofNullable(dto.getEndDate());

        registerDate.ifPresent(localDateTime -> builder.and(price.registerDate.eq(localDateTime)));
        productName.filter(s -> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.product.productName.contains(s)));
        customerName.filter(s -> !s.trim().isEmpty()).ifPresent(s -> builder.and(price.customer.customerName.contains(s)));
        startDate.ifPresent(localDate -> builder.and(price.startDate.after(localDate)));
        endDate.ifPresent(localDate -> builder.and(price.endDate.before(localDate)));
        builder.and(price.activated.eq(Y));

        List<PriceProductCustomerDTO> list = jpaQueryFactory
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
                .orderBy(price.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = jpaQueryFactory
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
                .fetch()
                .size();


        return new PageImpl<>(list, pageable, total);
    }

    @Override
    public List<Price> getPriceList(Customer customer, Product product) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;
        builder.and(price.activated.eq(Y));
        builder.and(price.product.productNo.eq(product.getProductNo()));
        builder.and(price.customer.customerNo.eq(customer.getCustomerNo()));
        builder.and(price.product.productYn.eq('Y'));
        builder.and(price.customer.activated.eq("Y"));

        return jpaQueryFactory.select(price).from(price).where(builder).orderBy(price.registerDate.desc()).fetch();
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

        BooleanBuilder builder = new BooleanBuilder();

        builder.and(price.priceNo.eq(entity.getPriceNo()));

        JPAUpdateClause updateQuery = jpaQueryFactory.update(price).where(builder);

        updateQuery.set(price.startDate, entity.getStartDate());
        updateQuery.set(price.endDate, entity.getEndDate());
        updateQuery.set(price.activated, entity.getActivated());

        updateQuery.execute();
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