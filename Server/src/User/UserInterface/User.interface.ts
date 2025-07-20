export interface UserSignUp {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}