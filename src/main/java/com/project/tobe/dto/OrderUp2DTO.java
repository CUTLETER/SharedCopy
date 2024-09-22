package com.project.tobe.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderUp2DTO {

  private Long productNo;
  private int orderProductQty;
  private Long priceNo;


}
