package com.shopifyy.shopifyy.request;

import java.util.List;

import com.shopifyy.shopifyy.model.Address;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private List<Address> addressList;
}
