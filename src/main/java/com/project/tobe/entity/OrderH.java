package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_header")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "orderBList")
@Builder
@SequenceGenerator(
        name = "seqOrder",
        sequenceName = "seq_order",
        initialValue = 1,
        allocationSize = 1
)
public class OrderH {

        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqOrder")
        @Column(name = "order_no")
        private Long orderNo;

        @Column(name = "reg_date")
        private LocalDate regDate;

        @Column(name = "del_date")
        private LocalDate delDate;

        @ManyToOne
        @JoinColumn(name = "customer_no")
        private Customer customer;

        @Enumerated(EnumType.STRING)
        @Column(name = "confirm_status")
        private ConfirmStatus confirmStatus;

        @Column(name = "confirm_change_date")
        private LocalDate confirmChangeDate;

        @Column(name = "remarks")
        private String remarks;

        @OneToMany(mappedBy = "orderH", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
        private List<OrderB> orderBList = new ArrayList<>();

        @ManyToOne
        @JoinColumn(name = "employee_id")
        private Employee employee;


        /*상태 값이 여러 개라 확실한 데이터 처리 필요하대서*/
        public enum ConfirmStatus {
                APPROVED,    // 승인
                REJECTED,    // 반려
                PENDING,     // 대기
                TEMPORARY    // 임시 저장
        }
}
