export enum AppointmentStatus {
    scheduled = 'scheduled',
    confirmed = 'confirmed',
    checked_in = 'checked_in',
    canceled = 'canceled',
    missed = 'missed',
    completed = 'completed',
}

export enum MedicalRecordEntryType {
    Allergy = 'allergy',
    Diagnosis = 'diagnosis',
    Observation = 'observation',
    Note = 'note',
    Vitals = 'vitals',
    Immunization = 'immunization',
    LabResult = 'lab_result',
    Treatment = 'treatment',
    Procedure = 'procedure',
    Other = 'other',
}
