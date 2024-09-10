package com.project.tobe.service;

import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface ConfirmService {
    Confirm saveConfirm(Confirm confirm);
    Confirm getConfirmById(Long id);
    List<Confirm> findAllConfirms();
    List<Confirm> searchConfirms(String customerName,
                                 String employeeName,
                                 LocalDate confirmRegDate,
                                 String confirmStatus);
    Confirm updateConfirm(Long id, Confirm confirmDetails);
}
