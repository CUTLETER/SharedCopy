package com.project.tobe.dto;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long productNo;
    private String productName;
    private String productWriter;
    private String productCategory;
    private Long productPrice;
    private Character productYn;
}




