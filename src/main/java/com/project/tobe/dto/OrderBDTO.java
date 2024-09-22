package com.project.tobe.dto;

import com.project.tobe.entity.Product;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderBDTO {

    private Long orderNo; //주문번호
    private Long productNo; //상품번호
    private Long priceNo; // 판매가 번호
    private Long orderProductQty; //수량
    private Long prodTotal; //상품 별 총액

    private ProductDTO product;
    private PriceDTO price;

}
