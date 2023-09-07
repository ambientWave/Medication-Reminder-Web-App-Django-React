import './App.css';
import Header from './components/Header';
import NotesListPage from './pages/NotesListPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotePage from './pages/NotePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        {/* routes enable us to make different components reside at different paths */}
        {/* exact prop restricts the loading of the respective component
        if and only if the url doesn't contain anything after the slash.
        Without "exact", any url that contains slash will load the component */}
        
        <Routes>
          <Route path="/" exact element={<NotesListPage/>}/>

          <Route path="/note/:id" element={<NotePage/>}/>

        </Routes>
    </div>
    </Router>

  );
}

export default App;
