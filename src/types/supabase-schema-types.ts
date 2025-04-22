export interface UserInfoType {
  id: string;
  name: string;
  email: string;
  braces_start_date: string;
  braces_end_date: string;

  clinic_info?: {
    doctor_name: string;
    clinic_name: string;
    address: string;
    notes: string;
    phones: { key: string; name: string; number: string }[];
  };
}
