import './App.css';
import Header from './components/Header';
import NotesListPage from './pages/NotesListPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotePage from './pages/NotePage';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container dark">
          <div className="app">
          {/* <SkeletonTheme baseColor="#202020" highlightColor="#444" duration={5} height={500}> */}
            <Header />
            {/* routes enable us to make different components reside at different paths */}
            {/* exact prop restricts the loading of the respective component
            if and only if the url doesn't contain anything after the slash.
            Without "exact", any url that contains slash will load the component */}

            <Routes>

              <Route element={<LoginPage />} path="/login" />
              {/* logout functionality is present in AuthContext but
              an element should be designed and put in suitable place in the UI */}
              <Route element={<RegisterPage />} path="/register" exact />
              <Route element={<ProtectedRoute/>}>
                <Route path="/" exact element={<NotesListPage />} />

                <Route path="/note/:id" element={<NotePage />} />
              </Route>

            </Routes>
          {/* </SkeletonTheme> */}
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
