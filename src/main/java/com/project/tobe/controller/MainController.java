package com.project.tobe.controller;

import com.project.tobe.entity.Employee;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@Controller
public class MainController {

    @Autowired
    @Qualifier("employeeService")
    private EmployeeService employeeService;

    @GetMapping("/{pageName}.do") // .do 해주세요
    public String page(@PathVariable String pageName, Authentication authentication, Model model) {
        System.out.println("뷰이름:" + pageName);

        //1st 컨트롤러에서 받기
        //System.out.println(authentication);
        if(authentication != null) { //인증이 되지않았다면 null입니다.
            EmployeeDetails user = (EmployeeDetails)authentication.getPrincipal(); //인증객체 안에 principal값을 얻으면 유저객체가 나옵니다.
            System.out.println("유저 이름 " + user.getUsername());
            System.out.println("유저 이름 " + user.getNickname());

            model.addAttribute("authName", user.getUsername());
            model.addAttribute("nickName", user.getNickname());
            model.addAttribute("auth", user.getUserAuthorityGrade());

        }


        return "layout"; //언제나 view화면으로 이동합니다.
    }

    @GetMapping("/{pageName}.user")
    public String login(@PathVariable String pageName, @RequestParam(value = "err", required = false) String err, Model model) {
        if ("true".equals(err)) {
            model.addAttribute("msg", "아이디, 비밀번호를 확인해주세요.");
        }
        return "login";
    }

//    @GetMapping("/login.user")
//    public ResponseEntity<Map<String, String>> login(@RequestParam(value = "err", required = false) String err) {
//        Map<String, String> response = new HashMap<>();
//        if ("true".equals(err)) {
//            response.put("msg", "아이디, 비밀번호를 확인해주세요.");
//        }
//        return ResponseEntity.ok(response);
//    }



//    @PostMapping("/loginForm")
//    public String loginValidate(Authentication auth) {
//        System.out.println("login -------");
//
//        System.out.println(auth.toString());
//
//        Employee employee = employeeService.getUserById(auth.getName());
//
//        if (employee == null) {
//            return "redirect:/login.user";
//        }
//
//        return "redirect:/main.do";
//    }
}