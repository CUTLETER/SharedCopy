package com.project.tobe.entity;

import com.project.tobe.util.constants.YesNo;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "price")
//@Check(name = "check_yes_no", expression = "activated IN ('y', 'n')")
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
    private LocalDate registerDate;
    @Column(name = "PRODUCT_NO")
    private Long productNo;
    @Column(name = "CUSTOMER_NO")
    private Long customerNo;
    private Double customPrice;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "activated", length = 1)
    private YesNo activated;

    public Price(
            LocalDate registerDate,
            Long productNo, Long customerNo,
            Double customPrice,
            String currency,
            Double discount,
            LocalDate startDate,
            LocalDate endDate,
            YesNo activated
    ) {
        this.registerDate = registerDate;
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.activated = activated;
    }

}
