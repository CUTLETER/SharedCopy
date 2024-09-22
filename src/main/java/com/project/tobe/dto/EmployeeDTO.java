package com.project.tobe.dto;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class EmployeeDTO {

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

    private String authorityName;

    private int page;
    private int amount;
    public int getPageStart() {
        return (page - 1) * amount;
    }
}
