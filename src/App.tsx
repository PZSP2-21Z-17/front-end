import { Link, Outlet } from 'react-router-dom';
import { JournalText, Question, Hash } from 'react-bootstrap-icons';

export const App = () => {
    return (
        <div id="container" className="container-fluid vh-100 p-0 d-flex flex-column">
            <header className="navbar navbar-expand navbar-dark bg-dark px-3">
                <Link className="navbar-brand mb-2" to="/">Front end</Link>
                <div className="d-flex flex-row-reverse w-100 mb-2">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/logout">Logout</Link>
                        </li>
                    </ul>
                </div>
            </header>
            <div className="flex-grow-1 d-flex">
                <nav className="bg-secondary" style={{ width: '280px' }}>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item">
                            <Link className="nav-link link-light" to="/exams">
                            <JournalText className="me-2" />
                                Exams
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link link-light" to="/questions">
                                <Question className="me-2" />
                                Questions
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
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default App;
