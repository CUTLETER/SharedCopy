package com.project.tobe.service;

import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;

import java.util.List;


public interface CustomerService {

    public List<CustomerDTO> getAllList();
    public List<CustomerDTO> getPickList(CustomerSearchDTO dto);
    public void customerRegistTest( List<CustomerDTO> dto);
    public void customerUpdateTest(CustomerDTO dto);
    public void customerDeleteTest(List<String> customerIds);

}
