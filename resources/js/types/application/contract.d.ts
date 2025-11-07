import { EmployeeInfo } from '@/types/application/employee';

export interface Contract {
    id: number;
    employee_info_id: number;

    start_date: Date;
    end_date: Date;

    rate_type: string;
    rate: string;
    contract_type: string;

    created_at: Date;
    updated_at: Date;
}

export interface ContractWithRelations extends Contract {
    employee_info?: EmployeeInfo;
}
