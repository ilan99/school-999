export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
  };
  birthDate: Date | null;
  registeredDate: Date;
  email: string;
  phone: {
    pre: string;
    number: number;
  };
}
