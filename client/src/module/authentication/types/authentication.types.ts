import { Role } from "../../../constants/role";
import { Admin } from "../../admin";
import { Moderator } from "../../moderator/types";
import { Student } from "../../student";
import { Teacher } from "../../teacher";

export type UserRole = (typeof Role)[keyof typeof Role];
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profilePicture: string;
  }

  export type AllUserProps = {
    [K in keyof Student | keyof Teacher | keyof Admin | keyof Moderator]?:
      K extends keyof Student ? Student[K] :
      K extends keyof Teacher ? Teacher[K] :
      K extends keyof Admin ? Admin[K] :
      K extends keyof Moderator ? Moderator[K] :
      never;
  };
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }
  export interface AuthResponse {
    user: User;
    accessToken: string;
  }