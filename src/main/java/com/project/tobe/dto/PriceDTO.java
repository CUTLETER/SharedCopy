package com.project.tobe.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class PriceDTO {
    private Long priceNo;
    private LocalDateTime registerDate;
    private String productNo;
    private String productName;
    private String customerNo;
    private String customerName;
    private Double customPrice;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;

    private int page = 1;
    private int amount = 50;

    public PriceDTO(String productNo, String customerNo, Double customPrice, String currency, Double discount, LocalDate startDate, LocalDate endDate) {
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public PriceDTO(LocalDateTime registerDate, String productNo, String customerNo, Double customPrice, String currency, Double discount, LocalDate startDate, LocalDate endDate, int page, int amount) {
        this.registerDate = registerDate;
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.page = page;
        this.amount = amount;
    }

    // offset - limit 함수에 앞에 전달될 값
    public int getPageStart() {
        return (page - 1) * amount;
    }


    //jsy 객체 필요
    private ProductDTO product;
}
