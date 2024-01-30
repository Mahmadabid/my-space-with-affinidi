import { Dispatch, SetStateAction, createContext } from "react";
import { UserInfo } from "./affinidi/types/types";

export interface UserDataProps {
    userId: string;
    user: UserInfo
}

export const UserDataValues = {
    userId: '',
    user: {
        email: '',
        country: ''
    }
}

export const UserContext = createContext<[UserDataProps, Dispatch<SetStateAction<UserDataProps>>]>(([UserDataValues, () => {}]));
