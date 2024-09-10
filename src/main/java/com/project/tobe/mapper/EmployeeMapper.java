package com.project.tobe.mapper;

import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.entity.Employee;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmployeeMapper {

  List<Employee> getAllList();
  List<Employee> getPickList(EmployeeSearchDTO dto);
}
