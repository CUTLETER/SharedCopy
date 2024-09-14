package com.project.tobe.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class CustomerSearchDTO {

    private Long customerNo;
    private String customerName;
    private String customerAddr;
    private String customerTel;
    private Integer postNum;
    private String businessRegistrationNo; // 수정된 필드 이름
    private String nation;
    private String dealType; // 수정된 필드 이름
    private String picName;
    private String picEmail;
    private String picTel; // 수정된 타입
    private String activated;
}
