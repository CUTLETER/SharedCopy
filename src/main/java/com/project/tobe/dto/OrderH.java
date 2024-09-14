package com.project.tobe.dto;

import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Employee;
import lombok.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderH {


    private Long orderNo; //주문 번호
    private Date regDate; //주문등록일
    private Date delDate; //납품일
    private Long customerNo;//고객번호
    private String confirmStatus; // 대기, 반려, 승인 3가지 있음
    private LocalDate confirmChangeDate; //결재상태변경일
    private String remarks; //반려사유
    private String employeeId; //직원아이디

    private CustomerDTO customer;
    private EmployeeDTO employee;
    private List<OrderB> orderBList;


}
