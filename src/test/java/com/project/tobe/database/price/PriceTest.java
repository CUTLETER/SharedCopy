//package com.project.tobe.database.price;
//
//import com.project.tobe.entity.Customer;
//import com.project.tobe.entity.Price;
//import com.project.tobe.entity.Product;
//import com.project.tobe.repository.CustomerRepository;
//import com.project.tobe.repository.PriceRepository;
//import com.project.tobe.repository.ProductRepository;
//import com.project.tobe.util.constants.YesNo;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDate;
//import java.util.Optional;
//
//@SpringBootTest
//public class PriceTest {
//    @Autowired
//    private PriceRepository priceRepository;
//    @Autowired
//    private ProductRepository productRepository;
//    @Autowired
//    private CustomerRepository customerRepository;
//
//    @Test
//    public void test1() {
//        Optional<Product> product1 = productRepository.findById(1001L);
//        Optional<Product> product2 = productRepository.findById(1003L);
//        Optional<Product> product3 = productRepository.findById(1005L);
//        Optional<Product> product4 = productRepository.findById(1001L);
//        Optional<Product> product5 = productRepository.findById(1002L);
//        Optional<Product> product6 = productRepository.findById(1004L);
//
//        Optional<Customer> customer1 = customerRepository.findById(2002L);
//        Optional<Customer> customer2 = customerRepository.findById(2003L);
//        Optional<Customer> customer3 = customerRepository.findById(2004L);
//
//        Price price1 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product1.get())
//                .customer(customer1.get())
//                .customPrice(150.75)
//                .currency("USD")
//                .discount(10.5)
//                .startDate(LocalDate.of(2024, 1, 1))
//                .endDate(LocalDate.of(2024, 12, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price2 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product2.get())
//                .customer(customer2.get())
//                .customPrice(250.00)
//                .currency("EUR")
//                .discount(5.0)
//                .startDate(LocalDate.of(2024, 2, 1))
//                .endDate(LocalDate.of(2024, 11, 30))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price3 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product3.get())
//                .customer(customer3.get())
//                .customPrice(175.50)
//                .currency("GBP")
//                .discount(7.5)
//                .startDate(LocalDate.of(2024, 3, 1))
//                .endDate(LocalDate.of(2024, 10, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price4 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product4.get())
//                .customer(customer1.get())
//                .customPrice(200.00)
//                .currency("JPY")
//                .discount(8.0)
//                .startDate(LocalDate.of(2024, 4, 1))
//                .endDate(LocalDate.of(2024, 9, 30))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price5 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product5.get())
//                .customer(customer2.get())
//                .customPrice(220.00)
//                .currency("CNY")
//                .discount(6.0)
//                .startDate(LocalDate.of(2024, 5, 1))
//                .endDate(LocalDate.of(2024, 8, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price6 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product6.get())
//                .customer(customer1.get())
//                .customPrice(180.00)
//                .currency("KRW")
//                .discount(4.5)
//                .startDate(LocalDate.of(2024, 6, 1))
//                .endDate(LocalDate.of(2024, 7, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price7 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product1.get())
//                .customer(customer3.get())
//                .customPrice(300.00)
//                .currency("USD")
//                .discount(9.5)
//                .startDate(LocalDate.of(2024, 7, 1))
//                .endDate(LocalDate.of(2025, 6, 30))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price8 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product2.get())
//                .customer(customer1.get())
//                .customPrice(130.00)
//                .currency("CAD")
//                .discount(3.0)
//                .startDate(LocalDate.of(2024, 8, 1))
//                .endDate(LocalDate.of(2025, 5, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price9 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product3.get())
//                .customer(customer1.get())
//                .customPrice(110.00)
//                .currency("AUD")
//                .discount(2.5)
//                .startDate(LocalDate.of(2024, 9, 1))
//                .endDate(LocalDate.of(2025, 4, 30))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price10 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product4.get())
//                .customer(customer1.get())
//                .customPrice(500.00)
//                .currency("SGD")
//                .discount(15.0)
//                .startDate(LocalDate.of(2024, 10, 1))
//                .endDate(LocalDate.of(2025, 3, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price11 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product5.get())
//                .customer(customer2.get())
//                .customPrice(140.00)
//                .currency("HKD")
//                .discount(6.5)
//                .startDate(LocalDate.of(2024, 11, 1))
//                .endDate(LocalDate.of(2025, 3, 29))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price12 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product6.get())
//                .customer(customer2.get())
//                .customPrice(160.00)
//                .currency("INR")
//                .discount(5.5)
//                .startDate(LocalDate.of(2024, 12, 1))
//                .endDate(LocalDate.of(2025, 1, 31))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price13 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product1.get())
//                .customer(customer1.get())
//                .customPrice(210.00)
//                .currency("BRL")
//                .discount(7.0)
//                .startDate(LocalDate.of(2024, 1, 15))
//                .endDate(LocalDate.of(2025, 12, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price14 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product2.get())
//                .customer(customer3.get())
//                .customPrice(125.00)
//                .currency("ZAR")
//                .discount(3.5)
//                .startDate(LocalDate.of(2024, 2, 15))
//                .endDate(LocalDate.of(2025, 11, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price15 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product3.get())
//                .customer(customer3.get())
//                .customPrice(180.00)
//                .currency("MXN")
//                .discount(6.0)
//                .startDate(LocalDate.of(2024, 3, 15))
//                .endDate(LocalDate.of(2025, 10, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price16 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product4.get())
//                .customer(customer3.get())
//                .customPrice(270.00)
//                .currency("RUB")
//                .discount(4.0)
//                .startDate(LocalDate.of(2024, 4, 15))
//                .endDate(LocalDate.of(2025, 9, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price17 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product5.get())
//                .customer(customer1.get())
//                .customPrice(155.00)
//                .currency("SEK")
//                .discount(5.0)
//                .startDate(LocalDate.of(2024, 5, 15))
//                .endDate(LocalDate.of(2025, 8, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price18 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product6.get())
//                .customer(customer1.get())
//                .customPrice(240.00)
//                .currency("NOK")
//                .discount(4.5)
//                .startDate(LocalDate.of(2024, 6, 15))
//                .endDate(LocalDate.of(2025, 7, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price19 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product1.get())
//                .customer(customer1.get())
//                .customPrice(190.00)
//                .currency("CHF")
//                .discount(8.0)
//                .startDate(LocalDate.of(2024, 7, 15))
//                .endDate(LocalDate.of(2025, 6, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        Price price20 = Price.builder()
//                .registerDate(LocalDate.now())
//                .product(product2.get())
//                .customer(customer1.get())
//                .customPrice(210.00)
//                .currency("NZD")
//                .discount(9.0)
//                .startDate(LocalDate.of(2024, 8, 15))
//                .endDate(LocalDate.of(2025, 5, 15))
//                .activated(YesNo.Y)
//                .build();
//
//        // Add all Price objects to the list
//        priceRepository.save(price1);
//        priceRepository.save(price2);
//        priceRepository.save(price3);
//        priceRepository.save(price4);
//        priceRepository.save(price5);
//        priceRepository.save(price6);
//        priceRepository.save(price7);
//        priceRepository.save(price8);
//        priceRepository.save(price9);
//        priceRepository.save(price10);
//        priceRepository.save(price11);
//        priceRepository.save(price12);
//        priceRepository.save(price13);
//        priceRepository.save(price14);
//        priceRepository.save(price15);
//        priceRepository.save(price16);
//        priceRepository.save(price17);
//        priceRepository.save(price18);
//        priceRepository.save(price19);
//        priceRepository.save(price20);
//    }
//}