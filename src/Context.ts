import React from 'react';

export type LoginState = {
    isLogged: boolean;
    username: string | null;
}
export type LoginStateInContext = {
    state: LoginState;
    setState: Function;
    setIsInProgress: (isInProgress: boolean) => void;
    setUsername: (username: string | null) => void;
};

export const LoginContext = React.createContext<LoginStateInContext>({
    state: { isLogged: true, username: null },
    setState: () => {},
    setIsInProgress: () => {},
    setUsername: () => {},
});
