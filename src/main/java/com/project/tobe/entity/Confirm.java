
package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table (name = "confirm")
@SequenceGenerator(
        name = "seqConfirm",
        sequenceName = "seq_confirm",
        initialValue = 1,
        allocationSize = 1
)

public class Confirm {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqConfirm")
    private Long confirmNo;

    private String confirmStatus; // 대기, 반려, 승인 3가지 있음

    private String confirmTitle;
    private LocalDate confirmRegDate;
    private LocalDate confirmDate;
    private String remarks;

//    일단 주석 처리
//    @ManyToOne
//    @JoinColumn (name = "price_no")
//    private Price price;

//    @ManyToOne
//    @JoinColumn (name = "employee_id")
//    private Employee employee;

//    @ManyToOne
//    @JoinColumn (name = "employee_id")
//    private Employee approver;

    private int customPrice;
    private Long orderNo;
    private LocalDate delDate;

    private String productName;
    private String productType;

    private String customerName;
    private int orderQty;
    private String employeeName;


    @Transient
    public double getTotalAmount() {
        return this.orderQty * this.customPrice;
    }
}