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

export enum NoticeType {
    Announcement = 'announcement',
    Info = 'info',
    Warning = 'warning',
    Alert = 'alert',
}

export enum ContractType {
    FullTime = 'full_time',
    PartTime = 'part_time',
    Contractor = 'contractor',
    Intern = 'intern',
}
