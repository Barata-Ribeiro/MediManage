export interface PatientInfo {
    id: number;
    user_id?: number;
    medical_record_id: number;
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    phone_number: string;
    address: string;
    insurance_company: string;
    insurance_member_id_number: string;
    insurance_group_number: string;
    insurance_policy_number: string;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_phone_number: string;
    allergies: string;
    current_medications: string;
    past_illnesses: string;
    surgeries: string;
    family_medical_history: string;
    created_at: string;
    updated_at: string;
}

export type TablePatientInfo = Pick<PatientInfo, 'id' | 'first_name' | 'last_name'>;
