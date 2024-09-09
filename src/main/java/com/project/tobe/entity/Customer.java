package com.project.tobe.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Setter
@Getter
@ToString
@Table(name= "customer")
public class Customer {

    @Id
    private Long customerNo;
    private String customerName;
    private String customerAddr;
    private String customerTel;
    private int postNum;
    private String businessRegistrationNo; // 수정된 필드 이름
    private String nation;
    private String dealType; // 수정된 필드 이름
    private String picName;
    private String picEmail;
    private String picTel; // 수정된 타입
    private char activated;

}
