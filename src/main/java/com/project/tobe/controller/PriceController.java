package com.project.tobe.controller;

import com.opencsv.exceptions.CsvValidationException;
import com.project.tobe.customer.CustomerService;
import com.project.tobe.dto.CustomerDTO;
import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Product;
import com.project.tobe.service.PriceService;
import com.project.tobe.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.project.tobe.util.constants.URLConstants.*;

@RestController
@RequestMapping(PRICE_HOME)
public class PriceController {
    private static final Logger log = LoggerFactory.getLogger(PriceController.class);
    @Autowired
    private PriceService priceService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private ProductService productService;

    @GetMapping(PRICE_ALL)
    public Map<String, List<?>> getAllPrice() {
        List<PriceProductCustomerDTO> priceList = priceService.getPriceProductCustomerDTO(new PriceDTO());
        List<Product> productList = productService.getProductList();
        List<CustomerDTO> customerList = customerService.getAllList();

        Map<String, List<?>> map = new HashMap<>();
        map.put("priceList", priceList);
        map.put("productList", productList);
        map.put("customerList", customerList);

        System.out.println(customerList);

        return map;
    }

    @PostMapping(value=SEARCH_PRICE , produces = "application/json", consumes = "application/json")
    public List<PriceProductCustomerDTO> searchPrice(@RequestBody PriceDTO dto) {
        return priceService.getPriceProductCustomerDTO(dto);
    }


    @PostMapping(value=REGISTER_PRICE, produces = "application/json", consumes = "application/json")
    public ResponseEntity<String> savePrice(@RequestBody List<PriceDTO> list) {
        return priceService.savePrice(list);
    }

    @PostMapping(value=REGISTER_PRICE_CSV, consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<String> savePriceByCsv (@RequestParam(value = "file") MultipartFile file) throws IOException, CsvValidationException {

        return priceService.savePriceByCsv(file);
    }

    @PostMapping(value=MODIFY_PRICE , produces = "application/json", consumes = "application/json")
    public ResponseEntity<String> updatePrice(@RequestBody PriceDTO dto) {
        return priceService.updatePrice(dto);
    }
}
