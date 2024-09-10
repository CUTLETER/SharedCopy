package com.project.tobe.serviceimpl;

import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import com.project.tobe.service.ConfirmService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConfirmServiceImpl implements ConfirmService {
    private final ConfirmRepository confirmRepository;

    @Override
    public Confirm saveConfirm(Confirm confirm) {
        return confirmRepository.save(confirm);
    }

    @Override
    public List<Confirm> findAllConfirms() {
        return confirmRepository.findAll();
    }

    @Override
    public List<Confirm> searchConfirms(String customerName, String employeeName, LocalDate confirmRegDate, String confirmStatus) {
        return confirmRepository.searchConfirms(customerName, employeeName, confirmRegDate, confirmStatus);
    }

    @Override
    public Confirm updateConfirm(Long id, Confirm confirmDetails) {
        Confirm confirm = getConfirmById(id);
        return confirmRepository.save(confirmDetails);
    }

    @Override
    public Confirm getConfirmById(Long id) {
        return confirmRepository.findById(id).orElse(null);
    }
}
