package com.project.tobe.repository;
import com.project.tobe.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository{

//  @Query("select e from Employee e order by e.employeeId desc")
//  List<Employee> getListDesc();

}
