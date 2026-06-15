export interface Address {
  city: string;
  postalCode: string;
}

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  email: string;
  username: string;
  birthDate: string;
  image: string;
  eyeColor: string;
  university: string;
  macAddress: string;
  ip: string;
  address: Address;
}

export interface UsersResponse {
  users: DummyUser[];
}

export interface GenderizeResponse {
  name: string;
  gender: string | null;
  probability: number;
  count: number;
}

export interface ZippopotamPlace {
  state: string;
}

export interface ZippopotamResponse {
  places: ZippopotamPlace[];
}

export interface BrowsingHistoryEntry {
  fullName: string;
  startTime: Date;
  endTime: Date;
}
