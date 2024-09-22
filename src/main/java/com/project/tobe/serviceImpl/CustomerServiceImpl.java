package com.project.tobe.serviceImpl;

import com.project.tobe.mapper.CustomerMapper;
import com.project.tobe.service.CustomerService;
import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("customerService")
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerMapper customerMapper;

    @Override
    public List<CustomerDTO> getAllList() {
        return customerMapper.getAllList();

    }

    @Override
    public List<CustomerDTO> getPickList(CustomerSearchDTO dto) {
        return customerMapper.getPickList(dto);
    }

    @Override
    public void customerRegistTest(List<CustomerDTO> dto) {
        customerMapper.customerRegistTest(dto);
    }


    @Override
    public void customerUpdateTest(CustomerDTO dto) {
        customerMapper.customerUpdateTest(dto);
    }


    @Override
    public void customerDeleteTest(List<String> customerIds) {
        System.out.println(2);
        System.out.println(customerIds.toString());

        customerMapper.customerDeleteTest(customerIds);
    }



}
