package com.project.tobe.controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.project.tobe.service.CustomerService;
import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    @Qualifier("customerService")
    private CustomerService customerService;

    // 고객 목록 불러오기
    @GetMapping("/customerAll")
    public List<CustomerDTO> customerAll() {
        List<CustomerDTO> customerList = customerService.getAllList();
        return customerService.getAllList();
    }

    //검색할때
    @PostMapping("/customerSearch")
    public List<CustomerDTO> customerPick(@RequestBody CustomerSearchDTO dto) {
        return customerService.getPickList(dto);
    }

    // 컨트롤러 메서드
    @PostMapping("/customerRegist")
    public ResponseEntity<String> customerRegistTest(@RequestBody List<CustomerDTO> dto) {
        customerService.customerRegistTest(dto);
        return ResponseEntity.ok("등록 성공");
    }

    //업데이트
    @PostMapping("/customerUpdate")
    public void customerUpdateTest(@RequestBody CustomerDTO dto) {
        customerService.customerUpdateTest(dto);
    }

    //삭제
    @PostMapping("/customerDelete")
    public void customerDeleteTest(@RequestBody List<String> customerIds) {
        System.out.println(1);
        customerService.customerDeleteTest(customerIds);
    }



}




