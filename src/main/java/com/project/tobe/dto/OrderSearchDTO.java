package com.project.tobe.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OrderSearchDTO {
    private LocalDate inputDate;
    private Integer inputOrderNo;
    private Integer inputProdNo;
    private String inputManager;
    private Integer inputCustomerNo;
    private String inputState;
}
