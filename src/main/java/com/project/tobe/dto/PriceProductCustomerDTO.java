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
public class PriceProductCustomerDTO {
    private LocalDateTime registerDate;
    private Long priceNo;
    private Long productNo;
    private String productName;
    private Long customerNo;
    private String customerName;
    private Double customPrice;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;
}
