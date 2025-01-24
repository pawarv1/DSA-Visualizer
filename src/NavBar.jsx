import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ArrayView from './pages/ArrayView';
import LinkedListsView from './pages/LinkedListsView';
import HashingView from './pages/HashingView';
import StacksAndQueuesView from './pages/StacksAndQueuesView';

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
            <li><Link to="/array">Arrays</Link></li>
            <li><Link to="/linkedlist">Linked Lists</Link></li>
            <li><Link to="/hashing">Hashing</Link></li>
            <li><Link to="/stacksqueues">Stacks and Queues</Link></li>
          </ul>
        </nav><br></br><br></br>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/array" element={<ArrayView></ArrayView>} />
          <Route path="/linkedlist" element={<LinkedListsView></LinkedListsView>} />
          <Route path="/hashing" element={<HashingView></HashingView>} />
          <Route path="/stacksqueues" element={<StacksAndQueuesView></StacksAndQueuesView>} />
        </Routes>
      </main>
    </Router>
  );
}

export default NavBar;