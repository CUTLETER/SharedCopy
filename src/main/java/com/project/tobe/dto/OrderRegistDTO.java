package com.project.tobe.dto;

import lombok.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class OrderRegistDTO {

    private Date inputDelDate; //납품요청일
    private Long inputCustomerNo; //고객번호
    private String inputManager; //담당자
    private String inputConfirmer; //결재자
    private String inputStatus; //결재상태 = 대기

    private List<OrderBDTO> orderBList;

//    private Long inputProdNo; //상품번호
//    private Long inputPriceNo; //판매가 번호
//    private Long inputProdQty; //수량
//    private Long inputProdTotal; //총액(수량 * 판매가)

}
