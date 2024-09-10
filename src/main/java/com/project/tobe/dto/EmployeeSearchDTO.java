package com.project.tobe.dto;


import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class EmployeeSearchDTO {

  private String employeeId;
  private String employeeName;
  private String employeeTel;
  private String employeeEmail;
  private String employeeAddr;
  private LocalDate hireDate;
  private String employeeManagerId;
  private String authorityGrade;
}
