import { EmployeeInfo } from '@/types/application/employee';
import { ContractType } from '@/types/application/enums';

export interface Contract {
    id: number;
    employee_info_id: number;

    start_date: Date;
    end_date: Date;

    rate_type: string;
    rate: string;
    contract_type: ContractType;

    created_at: Date;
    updated_at: Date;
}

export interface ContractWithRelations extends Contract {
    employee_info?: EmployeeInfo;
}
