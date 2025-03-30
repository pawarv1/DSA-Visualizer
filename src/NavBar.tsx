import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
// import AsymptoticAnalysisView from './pages/AsymptoticAnalysisView';
// import ArrayView from './pages/ArrayView';
// import LinkedListsView from './pages/LinkedListsView';
// import HashingView from './pages/HashingView';
// import StacksAndQueuesView from './pages/StacksAndQueuesView';
// import GraphsView from './pages/GraphsView';
import GeneralView from './pages/GeneralAnimating/GeneralView';
import ExperimentsView from './pages/Experimentation/ExperimentView';
import React from 'react';

/*
The navbar component handles page routing
*/

function NavBar() {
  return (
    <Router>
      <header>
        <nav>
          <ul className="navbar">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/general">General</Link></li>
            <li><Link to="/experimental">Experimental</Link></li>
          </ul>
        </nav><br></br><br></br>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/general" element={<GeneralView></GeneralView>}></Route>
          <Route path="/experimental" element={<ExperimentsView></ExperimentsView>}></Route>
        </Routes>
      </main>
    </Router>
  );
}

export default NavBar;