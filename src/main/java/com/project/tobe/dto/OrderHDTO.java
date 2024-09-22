package com.project.tobe.dto;

import lombok.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderHDTO {


    private Long orderNo; //주문 번호
    private LocalDateTime regDate; //주문등록일
    private Date delDate; //납품일
    private Long customerNo;//고객번호
    private String confirmStatus; // 임시저장, 대기, 반려, 승인 4가지 있음
    private LocalDate confirmChangeDate; //결재상태변경일
    private String remarks; //반려사유
    private String employeeId; //담당자 아이디
    private String confirmerId; //결재자 아이디
    private String confirmerName; //결재자 이름

    private CustomerDTO customer;
    private EmployeeDTO employee;
    private List<OrderBDTO> orderBList;


}
