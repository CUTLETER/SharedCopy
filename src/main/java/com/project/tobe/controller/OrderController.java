package com.project.tobe.controller;

import com.project.tobe.dto.OrderH;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.dto.PriceDTO;
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
    @Qualifier("orderservice")
    private OrderService orderService;

    //초기 목록 호출
    @GetMapping("/orderList")
    public List<OrderH> orderList (){
        System.out.println("orderList실행됨.");
        return orderService.getOrder(null);
    }

    @PostMapping("/searchSelect")
    public ResponseEntity<List<OrderH>> searchOrderList(@RequestBody OrderSearchDTO criteria) {
        List<OrderH> orders = orderService.getOrder(criteria);
        return ResponseEntity.ok(orders);
    }

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

}
