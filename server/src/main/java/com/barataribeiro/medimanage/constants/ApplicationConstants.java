package com.barataribeiro.medimanage.constants;

import org.jetbrains.annotations.NonNls;

public class ApplicationConstants {
    // Messages
    @NonNls
    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully.";

    @NonNls
    public static final String HOME_INFORETRIEVED_SUCCESSFULLY = "Home info retrieved successfully.";

    // Attributes
    @NonNls
    public static final String ALL_USERS = "allUsers";

    @NonNls
    public static final String CONSULTATIONS_BY_STATUS = "consultationsByStatus";

    @NonNls
    public static final String CREATED_AT = "createdAt";

    @NonNls
    public static final String LATEST_NOTICE = "latestNotice";

    @NonNls
    public static final String LATEST_PRESCRIPTION = "latestPrescription";

    @NonNls
    public static final String MEDICAL_RECORD = "medicalRecord";

    @NonNls
    public static final String NEXT_CONSULTATION = "nextConsultation";

    @NonNls
    public static final String RECENT_PRESCRIPTIONS = "recentPrescriptions";

    @NonNls
    public static final String TODAY_CONSULTATIONS = "todayConsultations";

    @NonNls
    public static final String TOTAL_ARTICLES = "totalArticles";

    @NonNls
    public static final String TOTAL_PRESCRIPTIONS = "totalPrescriptions";

    // Description
    @NonNls
    public static final String DEFAULT_CATEGORY_DESCRIPTION = "This is the %s category.";

    private ApplicationConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
