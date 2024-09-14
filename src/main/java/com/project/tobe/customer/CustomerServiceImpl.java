package com.project.tobe.customer;

import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//이름 어노 넣기
@Service("customerService")
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerMapper customerMapper; //매퍼와 연결하기

    @Override
    public List<CustomerDTO> getAllList() {
        return customerMapper.getAllList();

    }

    @Override
    public List<CustomerDTO> getPickList(CustomerSearchDTO dto) {
        System.out.println("서비스");
        System.out.println("작동됨 picList" + customerMapper.getPickList(dto));
        return customerMapper.getPickList(dto);
    }

    @Override
    public void customerRegistTest( List<CustomerDTO> dto) {
        System.out.println("서비스");
        customerMapper.customerRegistTest(dto);
    }

    @Override
    public void customerUpdateTest(CustomerDTO dto) {
        System.out.println("서비스");
        customerMapper.customerUpdateTest(dto);
    }


    @Override
    public void customerDeleteTest(List<String> customerIds) {
        System.out.println("서비스");
        customerMapper.customerDeleteTest(customerIds);
    }



}
