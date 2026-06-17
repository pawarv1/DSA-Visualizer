import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AsymptoticAnalysisView from './pages/AsymptoticAnalysisView';
import ArrayView from './pages/ArrayComponents/ArrayView';
import LinkedListView from './pages/LinkedListComponents/LinkedListView';
import HashingView from './pages/HashingComponents/HashingView';
import StackView from './pages/StacksAndQueuesComponents/StackComponents/StackView';
// import GraphsView from './pages/GraphsView';
import GeneralView from './pages/GeneralAnimating/GeneralView';
import React from 'react';

// The navbar component handles page routing

function NavBar() {
  return (
    <Router>
      <header>
        <nav>
          <ul className="navbar">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/general">General</Link></li>
            <li><Link to="/TimeSpace">Time/Space</Link></li>
            <li><Link to="/Arrays">Arrays</Link></li>
            <li><Link to="/LinkedList">Linked Lists</Link></li>
            <li><Link to="/Hashing">Hashing</Link></li>
            <li><Link to="/Stacks">Stacks</Link></li>
          </ul>
        </nav><br></br><br></br>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/general" element={<GeneralView></GeneralView>}></Route>
          <Route path="/TimeSpace" element={<AsymptoticAnalysisView></AsymptoticAnalysisView>}></Route>
          <Route path="/Arrays" element={<ArrayView></ArrayView>}></Route>
          <Route path = "/LinkedList" element={<LinkedListView></LinkedListView>}></Route>
          <Route path = "/Hashing" element={<HashingView></HashingView>}></Route>
          <Route path = "/Stacks" element={<StackView></StackView>}></Route>
        </Routes>
      </main>
    </Router>
  );
}

export default NavBar;