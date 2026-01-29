package com.shopifyy.shopifyy.service.user;

import com.shopifyy.shopifyy.dtos.UserDto;
import com.shopifyy.shopifyy.model.User;
import com.shopifyy.shopifyy.request.CreateUserRequest;
import com.shopifyy.shopifyy.request.UserUpdateRequest;

public interface IUserService {
    User createUser(CreateUserRequest request);

    User updateUser(UserUpdateRequest request, Long userId);

    User getUserById(Long userId);

    void deleteUser(Long userId);

    UserDto convertUserToDto(User user);

    User getAuthenticatedUser();
}


