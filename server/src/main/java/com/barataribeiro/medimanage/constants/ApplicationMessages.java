package com.barataribeiro.medimanage.constants;

import org.jetbrains.annotations.NonNls;

public final class ApplicationMessages {
    @NonNls
    public static final String USER_NOT_FOUND_WITH_ID = "User with ID %s not found.";
    @NonNls
    public static final String USER_NOT_FOUND_WITH_USERNAME = "User with username %s not found.";

    private ApplicationMessages() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
