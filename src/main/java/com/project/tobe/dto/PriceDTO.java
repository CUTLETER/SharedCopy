package com.project.tobe.dto;

import com.project.tobe.entity.Product;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class PriceDTO {
    private Long priceNo;
    private LocalDate registerDate;
    private String productNo;
    private String customerNo;
    private Double customPrice;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;

    public PriceDTO(String productNo, String customerNo, Double customPrice, String currency, Double discount, LocalDate startDate, LocalDate endDate) {
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    /*jsy*/
    private Product product;
}
