package com.project.tobe.serviceImpl;

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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public Page<PriceProductCustomerDTO> getPriceProductCustomerDTO(PriceDTO dto, Pageable pageable) {
        return priceRepository.getPriceJoinByDTO(dto, pageable);
    }


    @Override
    public ResponseEntity<String> savePrice(PriceDTO dto) {
        // Customer와 Product를 조회하여 연관관계를 설정
        Customer customer = customerRepository.findById(Long.parseLong(dto.getCustomerNo())).orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        Product product = productRepository.findById(Long.parseLong(dto.getProductNo())).orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Price price = Price.builder()
                .registerDate(LocalDateTime.now())
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
        fetchPrice(customer, product);

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

//        savePrice(dtoList);

        return ResponseEntity.ok().build();
    }

    private void fetchPrice(Customer customer, Product product) {
        List<Price> list = priceRepository.getPriceList(customer, product);

        for (int i = 0; i < list.size(); i++) {
            Price newPrice = list.get(i);
            for (int j = i + 1; j < list.size(); j++) {
                Price oldPrice = list.get(j);

                if (oldPrice.getStartDate().isAfter(newPrice.getEndDate()) || oldPrice.getEndDate().isBefore(newPrice.getStartDate())) {
                    continue;
                }

                if (oldPrice.getStartDate().isBefore(newPrice.getStartDate()) && oldPrice.getEndDate().isAfter(newPrice.getEndDate())) {
                    Price priceLeft = Price.builder()
                            .priceNo(oldPrice.getPriceNo())
                            .registerDate(oldPrice.getRegisterDate())
                            .product(oldPrice.getProduct())
                            .customer(oldPrice.getCustomer())
                            .customPrice(oldPrice.getCustomPrice())
                            .currency(oldPrice.getCurrency())
                            .discount(oldPrice.getDiscount())
                            .startDate(oldPrice.getStartDate())
                            .endDate(newPrice.getStartDate().minusDays(1))
                            .activated(oldPrice.getActivated())
                            .build();

                    Price priceRight = Price.builder()
                            .registerDate(oldPrice.getRegisterDate())
                            .product(oldPrice.getProduct())
                            .customer(oldPrice.getCustomer())
                            .customPrice(oldPrice.getCustomPrice())
                            .currency(oldPrice.getCurrency())
                            .discount(oldPrice.getDiscount())
                            .startDate(newPrice.getEndDate().plusDays(1))
                            .endDate(oldPrice.getEndDate())
                            .activated(oldPrice.getActivated())
                            .build();

                    priceLeft = checkStartOverEnd(priceLeft);
                    priceRight = checkStartOverEnd(priceRight);

                    list.set(j, priceLeft);
                    list.add(j + 1, priceRight);
                    continue;
                }

                if (
                        (
                                oldPrice.getStartDate().isAfter(newPrice.getStartDate()) ||
                                        oldPrice.getStartDate().isEqual(newPrice.getStartDate())

                        )
                                &&
                                (
                                        oldPrice.getEndDate().isBefore(newPrice.getEndDate()) ||
                                                oldPrice.getEndDate().isEqual(newPrice.getEndDate())
                                )
                ) {
                    oldPrice.setActivated(YesNo.N);
                }

                if (oldPrice.getStartDate().isAfter(newPrice.getStartDate()) && oldPrice.getEndDate().isAfter(newPrice.getEndDate())) {
                    oldPrice.setStartDate(newPrice.getEndDate().plusDays(1));
                }

                if (oldPrice.getStartDate().isBefore(newPrice.getStartDate()) && oldPrice.getEndDate().isBefore(newPrice.getEndDate())) {
                    oldPrice.setEndDate(newPrice.getStartDate().minusDays(1));
                }

                if (oldPrice.getStartDate().isAfter(oldPrice.getEndDate())) {
                    oldPrice.setActivated(YesNo.N);
                }

                list.set(j, oldPrice);
            }
        }

        for (Price price : list) {
            if (price.getPriceNo() == null) {
                priceRepository.save(price);
                continue;
            }
            priceRepository.updateOldPrice(price);
        }
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

    private Price checkStartOverEnd(Price price) {
        if (price.getStartDate().isAfter(price.getEndDate())) {
            price.setActivated(YesNo.N);
        }

        return price;
    }
}
