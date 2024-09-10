package com.project.tobe.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class PriceSearchDTO {
    private LocalDate registerDate;
    private String productNo;
    private String customerNo;
    private LocalDate startDate;
    private LocalDate endDate;
}
