package com.barataribeiro.medimanage.exceptions.users;

public class UserNotFound extends RuntimeException {
    public UserNotFound() {
        super("User not found.");
    }
}