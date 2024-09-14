package com.project.tobe.serviceimpl;

import com.project.tobe.dto.OrderH;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("orderservice")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public List<OrderH> getOrder(OrderSearchDTO criteria) {
        System.out.println("orderList서비스 실행됨");
        return orderMapper.getOrder(criteria);
    }

    @Override
    public List<PriceDTO> getPrice(Integer iocn) {
        System.out.println("getPrice서비스 실행됨");
        return orderMapper.getPrice(iocn);
    }


}
