package com.project.tobe.serviceimpl;

import com.opencsv.exceptions.CsvValidationException;
import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Price;
import com.project.tobe.entity.Product;
import com.project.tobe.repository.CustomerRepository;
import com.project.tobe.repository.PriceRepository;
import com.project.tobe.repository.ProductRepository;
import com.project.tobe.service.PriceService;
import com.project.tobe.util.constants.YesNo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static com.project.tobe.util.CSVToList.csvConvertToList;

@Service
public class PriceServiceImpl implements PriceService {
    @Autowired
    private PriceRepository priceRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<Price> getAllPrice() {
        return priceRepository.findByActivatedEquals(YesNo.Y);
    }

    @Override
    public List<Price> getPriceByDTO(PriceDTO dto) {
        return priceRepository.getPriceByDTO(dto);
    }

    @Override
    public List<PriceProductCustomerDTO> getPriceProductCustomerDTO(PriceDTO dto) {
        return priceRepository.getPriceJoinByDTO(dto);
    }


    @Override
    public ResponseEntity<String> savePrice(List<PriceDTO> list) {
        for (PriceDTO dto : list) {
            // Customer와 Product를 조회하여 연관관계를 설정
            Customer customer = customerRepository.findById(Long.parseLong(dto.getCustomerNo())).orElseThrow(() -> new EntityNotFoundException("Customer not found"));
            Product product = productRepository.findById(Long.parseLong(dto.getProductNo())).orElseThrow(() -> new EntityNotFoundException("Product not found"));

            Price price = Price.builder()
                    .registerDate(LocalDate.now())
                    .product(product)
                    .customer(customer)
                    .customPrice(Double.valueOf(dto.getCustomPrice()))
                    .currency(dto.getCurrency())
                    .discount(dto.getDiscount())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .activated(YesNo.Y)
                    .build();

            System.out.println(price);

            priceRepository.save(price);
            priceRepository.updateOldPrice(price);
        }

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<String> updatePrice(PriceDTO dto) {
        priceRepository.updatePrice(dto);

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<String> savePriceByCsv(MultipartFile file) throws IOException, CsvValidationException {
        List<List<String>> list = csvConvertToList(file.getInputStream());

        List<PriceDTO> dtoList = list.stream()
                .map(this::listToPriceDTO) // 각 List<String>을 PriceDTO로 변환
                .collect(Collectors.toCollection(LinkedList::new)); // LinkedList로 수집

        savePrice(dtoList);

        return ResponseEntity.ok().build();
    }

    private PriceDTO listToPriceDTO(List<String> list) {
        if (list.size() != 7) {
            return null;
        }

        String productNo = list.get(0);
        String customerNo = list.get(1);
        double customPrice = Double.parseDouble(list.get(2));
        String currency = list.get(3);
        double discount = Double.parseDouble(list.get(4));
        LocalDate startDate = LocalDate.parse(list.get(5));
        LocalDate endDate = LocalDate.parse(list.get(6));

        return new PriceDTO(productNo, customerNo, customPrice, currency, discount, startDate, endDate);
    }
}
