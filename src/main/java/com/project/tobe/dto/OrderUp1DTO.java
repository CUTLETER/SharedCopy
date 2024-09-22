package com.project.tobe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class OrderUp1DTO {
  private Long orderNo;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private Date delDate; // 납품일
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private Date confirmChangeDate; // 상태 변경일
  private Long customerNo; // 고객번호
  private String employeeId; // 직원아이디

   private List<OrderUp2DTO> orderBList; // 주문 세부 사항


}
