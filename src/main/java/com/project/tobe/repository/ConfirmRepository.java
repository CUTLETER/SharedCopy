package com.project.tobe.repository;

import com.project.tobe.entity.Confirm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConfirmRepository extends JpaRepository<Confirm, Long> {
    @Query("SELECT c FROM Confirm c WHERE " +
            "(:customerName IS NULL OR c.customerName LIKE %:customerName%) AND " +
            "(:employeeName IS NULL OR c.employeeName LIKE %:employeeName%) AND " +
            "(:confirmRegDate IS NULL OR c.confirmRegDate = :confirmRegDate) AND " +
            "(:confirmStatus IS NULL OR c.confirmStatus = :confirmStatus)")
    List<Confirm> searchConfirms(@Param("customerName") String customerName,
                                 @Param("employeeName") String employeeName,
                                 @Param("confirmRegDate") LocalDate confirmRegDate,
                                 @Param("confirmStatus") String confirmStatus);
}

