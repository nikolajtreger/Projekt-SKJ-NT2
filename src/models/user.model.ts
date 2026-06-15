export interface Location {
  city: string;
  zip: string;
}

export interface Actor {
  id: number;
  first: string;
  last: string;
  maiden?: string;
  email: string;
  username: string;
  dob: string;
  avatar: string;
  eyeCol: string;
  uni: string;
  mac: string;
  ipAddr: string;
  location: Location;
}

export interface ActorsData {
  users: Actor[];
}

export interface GenderAnalysis {
  name: string;
  gender: string | null;
  prob: number;
  qty: number;
}

export interface RegionData {
  state: string;
}

export interface RegionResponse {
  places: RegionData[];
}

export interface SessionRecord {
  actorName: string;
  tIn: Date;
  tOut: Date;
}
