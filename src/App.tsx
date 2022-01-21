import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { LoginState, LoginContext } from './Context';
import FetchAPI from './FetchAPI';
import MainLayout from './components/MainLayout';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import ExamsCreator from './routes/ExamsCreator';
import Tasks from './routes/Tasks';
import Tags from './routes/Tags';
import Subjects from './routes/Subjects';
import Login from './routes/Login';
import User from './routes/User';
import Register from './routes/Register';
import ExamsBrowser from './routes/ExamsBrowser';

export const App = () => {
    const [loginState, setLoginState] = useState<LoginState>({
        isLogged: false,
        username: null
    });
    const setLoginStateUsername = (username: string | null) => {
        setLoginState(prevState => ({...prevState, username: username }))
    }
    const setLoginStateIsLogged = (isInProgress: boolean) => {
        setLoginState(prevState => ({...prevState, isLogged: isInProgress }))
    }

    useEffect(() => {
        FetchAPI.getUserLogged().then(
            (json: any) => {
                setLoginStateUsername(json.e_mail);
                setLoginStateIsLogged(true);}
        )
    }, []);

    const loginProvider = {
        state: loginState,
        setState: setLoginState,
        setIsLogged: setLoginStateIsLogged,
        setUsername: setLoginStateUsername
    };

    return (
        <LoginContext.Provider value={loginProvider}>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="" element={<Home />} />
                    <Route path="exams">
                        <Route index element={<ExamsBrowser />} />
                        <Route path="create" element={<ExamsCreator />} />
                    </Route>
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="tags" element={<Tags />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="user" element={<User />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </LoginContext.Provider>
    );
};

export default App;
