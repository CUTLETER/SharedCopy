package com.project.tobe.controller;

import com.project.tobe.dto.*;
import com.project.tobe.entity.OrderH;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    @Qualifier("orderService")
    private OrderService orderService;

    //jsy초기 목록 호출
    @GetMapping("/orderList")
    public List<OrderHDTO> orderList (){
        System.out.println("orderList실행됨.");
        return orderService.getOrder(null);
    }

    //jsy주문 조건 별 조회
    @PostMapping("/searchSelect")
    public ResponseEntity<List<OrderHDTO>> searchOrderList(@RequestBody OrderSearchDTO criteria) {
        List<OrderHDTO> orders = orderService.getOrder(criteria);
        return ResponseEntity.ok(orders);
    }

    //jsy주문등록 - 고객 별 판매가
    @PostMapping("/getPrice")
    public ResponseEntity<List<PriceDTO>> getPrice(@RequestBody Map<String, String> request){
        String inputOrderCustomerNo = request.get("inputOrderCustomerNo"); //문자열로 단일객체 받아서
        List<PriceDTO> customPrice;


        if( inputOrderCustomerNo == null || inputOrderCustomerNo.isEmpty() ){ //고객명 선택x
            customPrice = new ArrayList<>(); //빈 리스ㅡㅌ 반환

        }else { //고객명 데이터 들어있으면
            Integer iocn = Integer.parseInt(inputOrderCustomerNo); //데이터 정수변환
            customPrice = orderService.getPrice(iocn);
        }

        return ResponseEntity.ok(customPrice);
    }

    //jsy주문등록 - 등록하기
    @PostMapping("/registOrder")
    public ResponseEntity<Void> registOrder(@RequestBody OrderRegistDTO request){
        orderService.registOrder(request);

        return ResponseEntity.ok().build();
    }


    /* 유선화 START */
    // 주문 상세 정보 조회
    @GetMapping("/detail/{orderNo}")
    public ResponseEntity<OrderHDTO> getOrderDetail(@PathVariable Long orderNo) {
        OrderHDTO orderDetail = orderService.getOrderDetail(orderNo);
        if (orderDetail != null) {
            return ResponseEntity.ok(orderDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 주문 업데이트
    @PostMapping("/updateOrder")
    public void updateOrder(@RequestBody OrderUp1DTO orderH) {
        orderService.updateOrder(orderH);
        System.out.println(orderH);
        System.out.println("오더 업데이트 컨트롤러");
    }
    /* 유선화 END */
}