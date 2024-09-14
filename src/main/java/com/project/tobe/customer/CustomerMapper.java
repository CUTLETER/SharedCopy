package com.project.tobe.customer;

import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper //매퍼 추가~~~~~
public interface CustomerMapper {
    public List<CustomerDTO> getAllList();
    public List<CustomerDTO> getPickList(CustomerSearchDTO dto);
    public void customerRegistTest( List<CustomerDTO> dto);
    public void customerUpdateTest(CustomerDTO dto);
    public void customerDeleteTest(List<String> customerIds);

}
