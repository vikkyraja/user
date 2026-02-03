// src/types/user.types.ts
export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface UserLocation {
  street: {
    number: number;
    name: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: string | number;
}

export interface UserDob {
  date: string;
  age: number;
}

export interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface UserLogin {
  uuid: string;
  username: string;
}

export interface ApiUser {
  name: UserName;
  email: string;
  gender: string;
  location: UserLocation;
  dob: UserDob;
  phone: string;
  cell: string;
  picture: UserPicture;
  login: UserLogin;
  nat: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female';
  country: string;
  city: string;
  age: number;
  phone: string;
  picture: string;
  nationality: string;
}

export interface ApiResponse {
  results: ApiUser[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

export interface TableFilters {
  search: string;
  gender: string;
  country: string;
}

export type DensityType = 'compact' | 'normal' | 'comfortable';