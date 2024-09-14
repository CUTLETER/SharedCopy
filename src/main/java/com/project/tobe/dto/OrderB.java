package com.project.tobe.dto;

import com.project.tobe.entity.Product;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderB {
    private Long orderNo;
    private Long productNo;
    private int orderProductQty;


    private Product product;

}
