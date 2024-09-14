package com.project.tobe.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Employee {
    @Id
    private String employeeId;
    private String employeePw;
    private String employeeName;
    private String employeeTel;
    private String employeeEmail;
    private String employeeAddr;
    private String residentNum;
    private LocalDate hireDate;
    private Long salary;
    private String employeeManagerId;
    private String authorityGrade;
    private String emplYn;
}
