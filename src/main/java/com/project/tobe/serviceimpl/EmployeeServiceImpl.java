package com.project.tobe.serviceimpl;


import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.mapper.EmployeeMapper;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("employeeService")
public class EmployeeServiceImpl implements EmployeeService {

  @Autowired
  EmployeeMapper employeeMapper;

  @Override
  public List<Employee> getAllList() {
    return employeeMapper.getAllList();

  }

  @Override
  public List<Employee> getPickList(EmployeeSearchDTO dto) {
    System.out.println("서비스");
    System.out.println("작동됨 picList" + employeeMapper.getPickList(dto));
    return employeeMapper.getPickList(dto);
  }


}
