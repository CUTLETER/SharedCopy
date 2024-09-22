package com.project.tobe.service;

import com.opencsv.exceptions.CsvValidationException;
import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface PriceService {
    Page<PriceProductCustomerDTO> getPriceProductCustomerDTO(PriceDTO dto, Pageable pageable);


    ResponseEntity<String> savePrice(PriceDTO dto);

    ResponseEntity<String> updatePrice(PriceDTO dto);

    ResponseEntity<String> savePriceByCsv(MultipartFile file) throws IOException, CsvValidationException;
}
