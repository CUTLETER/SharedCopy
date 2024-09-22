package com.project.tobe.service;

import com.project.tobe.dto.EmailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

public interface EmailService {
    boolean sendMailReject(EmailDTO inDTO) throws Exception;
}
