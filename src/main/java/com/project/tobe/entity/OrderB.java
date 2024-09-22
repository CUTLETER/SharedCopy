package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "order_body")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderB {

    @EmbeddedId
    private OrderBId orderBId;

    @ManyToOne
    @MapsId("orderNo")
    @JoinColumn(name = "order_no")
    private OrderH orderH;

    @ManyToOne
    @MapsId("productNo")
    @JoinColumn(name = "product_no")
    private Product product;

    @Column(name = "order_product_qty")
    private int orderProductQty;

    /*JPA 복합키 - 내부 클래스*/
    @Embeddable
    public static class OrderBId implements Serializable {

        @Column(name = "order_no")
        private Long orderNo;

        @Column(name = "product_no")
        private Long productNo;

        // equals and hashCode methods

        public OrderBId() {
        }

        public OrderBId(Long orderNo, Long productNo) {
            this.orderNo = orderNo;
            this.productNo = productNo;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            OrderBId that = (OrderBId) o;
            return Objects.equals(orderNo, that.orderNo) && Objects.equals(productNo, that.productNo);
        }

        @Override
        public int hashCode() {
            return Objects.hash(orderNo, productNo);
        }
    }
}
