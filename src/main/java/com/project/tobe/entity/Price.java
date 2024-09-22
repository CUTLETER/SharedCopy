package com.project.tobe.entity;

import com.project.tobe.util.constants.YesNo;
import lombok.*;
import org.hibernate.annotations.Check;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "price")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "seqPrice",
        sequenceName = "seq_price",
        initialValue = 1,
        allocationSize = 1
)
public class Price {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqPrice")
    private Long priceNo;

    @Column(name = "register_date", columnDefinition = "timestamp")
    private LocalDateTime registerDate;
    private Double customPrice;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "activated", length = 1)
    private YesNo activated;

    @ManyToOne
    @JoinColumn(name = "product_no")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "customer_no")
    private Customer customer;

    public Price(
            LocalDateTime registerDate,
//            Long productNo, Long customerNo,
            Double customPrice,
            String currency,
            Double discount,
            LocalDate startDate,
            LocalDate endDate,
            YesNo activated
    ) {
        this.registerDate = registerDate;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.activated = activated;
    }
}