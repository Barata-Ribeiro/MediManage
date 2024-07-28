package com.barataribeiro.medimanage.constants;

import org.jetbrains.annotations.NonNls;

public final class ApplicationMessages {
    @NonNls
    public static final String USER_NOT_FOUND_WITH_ID = "User with ID %s not found.";

    @NonNls
    public static final String USER_NOT_FOUND_WITH_USERNAME = "User with username %s not found.";

    @NonNls
    public static final String USER_NOT_FOUND_WITH_NAME = "User with name %s not found.";

    @NonNls
    public static final String MEDICAL_RECORD_NOT_FOUND_WITH_ID = "Medical record with ID %s not found.";

    @NonNls
    public static final String MEDICAL_RECORD_NOT_FOUND_WITH_NAME = "Medical record with name %s not found.";

    @NonNls
    public static final String PRESCRIPTION_NOT_FOUND_WITH_ID = "Prescription with ID %s not found.";

    private ApplicationMessages() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
