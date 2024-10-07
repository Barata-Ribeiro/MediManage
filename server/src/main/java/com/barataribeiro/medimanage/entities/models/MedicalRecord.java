package com.barataribeiro.medimanage.entities.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_medical_records")
public class MedicalRecord implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER, optional = false, orphanRemoval = true)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(name = "insurance_company")
    private String insuranceCompany;

    @Column(name = "insurance_member_id_number")
    private String insuranceMemberIdNumber;

    @Column(name = "insurance_group_number")
    private String insuranceGroupNumber;

    @Column(name = "insurance_policy_number")
    private String insurancePolicyNumber;

    @ToString.Exclude
    @Builder.Default
    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<Consultation> consultations = new ArrayList<>();

    private String allergies;

    private String medications;

    @Column(name = "medical_history")
    private String medicalHistory;

    @Column(name = "family_medical_history")
    private String familyMedicalHistory;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;

}