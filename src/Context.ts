import React from 'react';

export type LoginState = {
    isLogged: boolean;
    username: string | null;
}
export type LoginStateInContext = {
    state: LoginState;
    setState: Function;
    setIsLogged: (isInProgress: boolean) => void;
    setUsername: (username: string | null) => void;
};

export const LoginContext = React.createContext<LoginStateInContext>({
    state: { isLogged: true, username: null },
    setState: () => {},
    setIsLogged: () => {},
    setUsername: () => {},
});
