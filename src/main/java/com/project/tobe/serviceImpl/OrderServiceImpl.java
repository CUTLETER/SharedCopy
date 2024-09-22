package com.project.tobe.serviceImpl;

import com.project.tobe.dto.*;
import com.project.tobe.entity.OrderH;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service("orderService")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    //jsy 모든 주문 목록 조회
    @Override
    public List<OrderHDTO> getOrder(OrderSearchDTO criteria) {
        return orderMapper.getOrder(criteria);
    }

    //jsy 주문등록 - 고객 별 판매가 리스트
    @Override
    public List<PriceDTO> getPrice(Integer iocn, String delDate) {
        return orderMapper.getPrice(iocn, delDate);
    }

    //jsy 주문등록 - 등록하기
    @Override
    @Transactional
    public Long registOrder(OrderRegistDTO orderRequest) {
        //헤더 등록
        OrderHDTO header = OrderHDTO.builder()
                .delDate(orderRequest.getInputDelDate())
                .customerNo(orderRequest.getInputCustomerNo())
                .employeeId(orderRequest.getInputManager())
                .confirmerId(orderRequest.getInputConfirmer())
                .confirmStatus(orderRequest.getInputStatus())
                .build();
        orderMapper.registOrderH(header); //헤더 등록
        Long orderNo = header.getOrderNo(); //시퀀스로 생성된 orderNo

        //주문번호 추가 후 바디는 배치로 처리하기
        List<OrderBDTO> obList = orderRequest.getOrderBList().stream()
                        .map(orderBody -> OrderBDTO.builder()
                                .orderNo(orderNo)
                                .priceNo(orderBody.getPriceNo())
                                .productNo(orderBody.getProductNo())
                                .orderProductQty(orderBody.getOrderProductQty())
                                .prodTotal(orderBody.getProdTotal())
                                .build())
                                .collect(Collectors.toList());

        orderMapper.registOrderB(obList); //배치 인서트 처리

        return orderNo;
    }

    @Override
    public String getMyName(String myId) {
        return orderMapper.getMyName(myId);
    }

    /* 유선화 START */

// 특정 주문 상세 정보
    @Override
    public OrderHDTO getOrderDetail(Long orderNo) {
        System.out.println(orderMapper.getOrderDetail(orderNo));
        return orderMapper.getOrderDetail(orderNo);
    }


// 결재 여부 업데이트
    @Override
    @Transactional
    public boolean updateApproval(Long orderNo, String confirmStatus, LocalDate confirmChangeDate, String remarks) {
        try {
            int updatedRows = orderMapper.updateApproval(orderNo, confirmStatus, confirmChangeDate, remarks);
            return updatedRows > 0;
        } catch (Exception e) {
            System.out.println("updateApproval 오류");
            return false;
        }
    }

    @Override
    public OrderHDTO updateOrder(OrderUp1DTO orderUp1DTO) {
        // 주문 헤더 업데이트
        orderMapper.updateOrderHeader(orderUp1DTO);

        // 기존 주문 상세 삭제
        orderMapper.deleteOrderDetails(orderUp1DTO.getOrderNo());

        // 새로운 주문 상세 추가
        for (OrderUp2DTO detail : orderUp1DTO.getOrderBList()) {
            orderMapper.insertOrderDetail(orderUp1DTO.getOrderNo(), detail);
        }

        // 업데이트된 주문 정보 조회 및 반환
        return orderMapper.getOrderDetail(orderUp1DTO.getOrderNo());
    }


    @Transactional
    @Override
    public void insertBack(OrderUp1DTO orderUp1DTO) {
        // 1. 주문 헤더 삽입
        System.out.println("서비스 도착 ");
        orderMapper.insertBack1(orderUp1DTO);

        // 2. 생성된 주문 번호 가져오기
        Long orderNo = orderUp1DTO.getOrderNo();

        orderMapper.insertBack2(orderUp1DTO.getOrderBList(), orderNo);
    }

    @Transactional
    @Override
    public OrderHDTO updateTempOrder(OrderHDTO orderHDTO) {
        // 주문 헤더 업데이트
        int updatedRows = orderMapper.updateTempOrder(orderHDTO);

        // 기존 주문 상세 삭제
        orderMapper.deleteOrderDetails(orderHDTO.getOrderNo());

        // 새로운 주문 상세 삽입
        if (orderHDTO.getOrderBList() != null && !orderHDTO.getOrderBList().isEmpty()) {
            orderMapper.insertOrderDetails(orderHDTO.getOrderBList());
        }

        // 업데이트된 주문 정보 조회 및 반환
        return orderMapper.getOrderDetail(orderHDTO.getOrderNo());
    }

    @Override
    public boolean deleteOrder(Long orderNo) {
        int deletedRows = orderMapper.deleteOrder(orderNo);
        return deletedRows > 0; // 삭제된 행이 1개 이상이면 true 반환
    }
}