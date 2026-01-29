package com.example.demo;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class helloWorld {
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello Spring  demo";
    }
    
}
