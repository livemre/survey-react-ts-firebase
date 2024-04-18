import { Dispatch, SetStateAction, createContext } from "react";

import { User } from "firebase/auth";


export interface AuthProps {
    curUser : User | null
}

export interface UserProps {
    uid: string;
    photoURL: string;
    email: string;
    username: string,
    firstName : string,
    lastName: string,
    desc : string
  }

  interface UserDataContextProps {
    userData: UserProps | null;
    setUserData: Dispatch<SetStateAction<UserProps | null>>;
    getUserData: () => void;
  }

export const AuthContext = createContext<AuthProps | null>(null)



export const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);
