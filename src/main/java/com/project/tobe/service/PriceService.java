package com.project.tobe.service;

import com.opencsv.exceptions.CsvValidationException;
import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Price;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PriceService {
    List<Price> getAllPrice();
    List<Price> getPriceByDTO(PriceDTO dto);
    List<PriceProductCustomerDTO> getPriceProductCustomerDTO(PriceDTO dto);


    ResponseEntity<String> savePrice(List<PriceDTO> list);

    ResponseEntity<String> updatePrice(PriceDTO dto);

    ResponseEntity<String> savePriceByCsv(MultipartFile file) throws IOException, CsvValidationException;
}
