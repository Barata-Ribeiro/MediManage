export interface Session {
    id: string;
    user_id: number;
    ip_address: string;
    is_current_device: boolean;
    user_agent: string;
    last_activity: string;
    last_activity_label: string;
}
