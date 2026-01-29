package com.shopifyy.shopifyy.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopifyy.shopifyy.dtos.AddressDto;
import com.shopifyy.shopifyy.model.Address;
import com.shopifyy.shopifyy.response.ApiResponse;
import com.shopifyy.shopifyy.service.address.IAddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/addresses")
public class AddressController {

    private final IAddressService addressService;

    @PostMapping("/{userId}/new")
    public ResponseEntity<ApiResponse> createAddresses(@RequestBody List<Address> addresses, @PathVariable Long userId) {
        List<Address> addressList = addressService.createAddress(addresses, userId);
        List<AddressDto> addressDto = addressService.convertToDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Address added successfully!", addressDto));
    }

    @GetMapping("/{userId}/address")
    public ResponseEntity<ApiResponse> getUserAddresses(@PathVariable Long userId) {
        List<Address> addressList = addressService.getUserAddresses(userId);
        List<AddressDto> addressDto = addressService.convertToDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Found!", addressDto));
    }

    @GetMapping("/{id}/address")
    public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        AddressDto addressDto = addressService.convertToDto(address);
        return ResponseEntity.ok(new ApiResponse("Found!", addressDto));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        Address updatedAddress = addressService.updateAddress(id, address);
        AddressDto addressDto = addressService.convertToDto(updatedAddress);
        return ResponseEntity.ok(new ApiResponse("Address updated Successfully!", addressDto));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(new ApiResponse("Address deleted successfully", id));
    }
}