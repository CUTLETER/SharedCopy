package com.project.tobe.service;

import com.project.tobe.dto.OrderH;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.dto.PriceDTO;

import java.util.List;

public interface OrderService {

    List<OrderH> getOrder(OrderSearchDTO criteria); //조건조회
    List<PriceDTO> getPrice(Integer iocn); //주문등록 판매가 가져오기

}
