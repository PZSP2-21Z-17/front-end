import { useEffect, useState } from 'react';
import { matchPath, useLocation, Link, Outlet } from 'react-router-dom';
import { JournalText, Question, Hash, BookHalf } from 'react-bootstrap-icons';

import { LoginState, LoginContext } from './Context';
import ReactSession from './ReactSession';
import { refresh } from './Common';

let userOptions = (ReactSession.checkValue('username')) ? (<>
    <li className="nav-item">
        <Link className="nav-link" to="#">You are logged in as {ReactSession.getValue('username')}.</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" to="/user">User</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" to="/" onClick={() => {ReactSession.removeValue('username'); refresh();}}>Logout</Link>
    </li>
</>) : (<>
    <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" to="/register">Register</Link>
    </li>
</>)

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
        let user = ReactSession.getValue('username');
        if (user) {
            setLoginStateUsername(user);
            setLoginStateIsLogged(true);
        }
    }, []);

    const loginProvider = {
        state: loginState,
        setState: setLoginState,
        setIsInProgress: setLoginStateIsLogged,
        setUsername: setLoginStateUsername
    };

    return (
        <LoginContext.Provider value={loginProvider}>
            <div id="container" className="container-fluid vh-100 p-0 d-flex flex-column">
                <header className="navbar navbar-expand navbar-dark bg-dark px-3">
                    <Link className="navbar-brand mb-2" to="/">Front end</Link>
                    <div className="d-flex flex-row-reverse w-100 mb-2">
                        <ul className="navbar-nav">
                            {userOptions}
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
