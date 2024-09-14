package com.project.tobe.repository;
import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, String> {




}
