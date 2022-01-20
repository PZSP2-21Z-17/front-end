import { useEffect, useState } from 'react';
import { matchPath, useLocation, Link, Outlet } from 'react-router-dom';
import { JournalText, Question, Hash, BookHalf } from 'react-bootstrap-icons';

import { LoginState, LoginContext } from './Context';
import FetchAPI from './FetchAPI';

export const App = () => {
    const location = useLocation();
    const shouldUsePadding = !matchPath(location.pathname, '/exams');
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

    const logout = () => {
        FetchAPI.postUserLogout().then(
            (json: any) => {
                loginProvider.setUsername(null);
                loginProvider.setIsLogged(false);
            }
        );
    }

    const navBar = loginProvider.state.isLogged ? (<>
        <li className="nav-item">
            <Link className="nav-link" to="#">You are logged in as {loginProvider.state.username}.</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/user">User</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/" onClick={() => logout()}>Logout</Link>
        </li>
    </>) : (<>
        <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
        </li>
    </>)

    return (
        <LoginContext.Provider value={loginProvider}>
            <div id="container" className="container-fluid vh-100 p-0 d-flex flex-column">
                <header className="navbar navbar-expand navbar-dark bg-dark px-3">
                    <Link className="navbar-brand mb-2" to="/">Front end</Link>
                    <div className="d-flex flex-row-reverse w-100 mb-2">
                        <ul className="navbar-nav">
                            {navBar}
                        </ul>
                    </div>
                </header>
                <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    <nav className="bg-secondary" style={{ minWidth: '240px', maxWidth: '240px' }}>
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <Link className="nav-link link-light" to="/subjects">
                                <BookHalf className="me-2" />
                                    Subjects
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link link-light" to="/exams">
                                <JournalText className="me-2" />
                                    Exams
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link link-light" to="/tasks">
                                    <Question className="me-2" />
                                    Tasks
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link link-light" to="/tags">
                                    <Hash className="me-2" />
                                    Tags
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <main className="flex-grow-1">
                        <div className={shouldUsePadding ? 'p-5' : 'd-flex h-100'}
                            style={shouldUsePadding ? { overflow: "auto", height: "100%" } : {}}>
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </LoginContext.Provider>
    );
};

export default App;
