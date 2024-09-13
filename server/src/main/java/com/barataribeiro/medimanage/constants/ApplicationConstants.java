package com.barataribeiro.medimanage.constants;

public class ApplicationConstants {
    // Messages
    public static final String HOME_INFORETRIEVED_SUCCESSFULLY = "Home info retrieved successfully.";
    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully.";

    // Attributes
    public static final String ALL_USERS = "allUsers";
    public static final String CONSULTATIONS_BY_STATUS = "consultationsByStatus";
    public static final String CONSULTATIONS_FOR_TODAY = "consultationsForToday";
    public static final String CREATED_AT = "createdAt";
    public static final String HEARTBEAT = "heartbeat";
    public static final String ISSUED_AT = "issuedAt";
    public static final String LATEST_NOTICE = "latestNotice";
    public static final String LATEST_PRESCRIPTION = "latestPrescription";
    public static final String MEDICAL_RECORD = "medicalRecord";
    public static final String NEXT_CONSULTATION = "nextConsultation";
    public static final String PRINCIPAL = "principal";
    public static final String RECENT_PRESCRIPTIONS = "recentPrescriptions";
    public static final String TOTAL_ARTICLES = "totalArticles";
    public static final String TOTAL_CONSULTATIONS_FOR_TODAY = "totalConsultationsForToday";
    public static final String TOTAL_PRESCRIPTIONS = "totalPrescriptions";

    // Description
    public static final String DEFAULT_CATEGORY_DESCRIPTION = "This is the %s category.";

    private ApplicationConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
