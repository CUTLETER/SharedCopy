package com.project.tobe.controller;

import com.project.tobe.customer.CustomerService;
import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import com.project.tobe.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //리액트용
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    @Qualifier("customerService") //주입받는 경로?
    private CustomerService customerService;

    // 고객 목록 불러오기
    @GetMapping("/customerALL")
    public List<CustomerDTO> customerALL() {
        List<CustomerDTO> customerList = customerService.getAllList();

        System.out.println("나오나 안나오나");
        System.out.println(customerList);

        System.out.println(customerService.getAllList());

        return customerService.getAllList();
    }

    //검색할때
    @PostMapping("/customerSearch")
    public List<CustomerDTO> customerPick(@RequestBody CustomerSearchDTO dto) {
        System.out.println("검색 예제 컨트롤러");
        System.out.println(dto);
        return customerService.getPickList(dto);
    }

    //등록
    @PostMapping("/addCustomer")
    public void customerRegistTest(@RequestBody List<CustomerDTO> dto) {
        System.out.println("등록 예제 컨트롤러");
        System.out.println(dto);
        customerService.customerRegistTest(dto);
    }

    //업데이트
    @PostMapping("/customerUpdate")
    public void customerUpdateTest(@RequestBody CustomerDTO dto) {
        System.out.println("등록 예제 컨트롤러");
        System.out.println(dto);
        customerService.customerUpdateTest(dto);
    }

    //삭제
    @PostMapping("/customerDelete")
    public void customerDeleteTest(@RequestBody List<String> customerIds) {
        System.out.println("등록 예제 컨트롤러");
        System.out.println(customerIds);
        customerService.customerDeleteTest(customerIds);
    }



}




