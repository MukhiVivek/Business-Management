import './App.css'
import Home from './landing_page/home/Home'
import Sidebar from './landing_page/includes/Sidebar';

function App() {
  return (
    <>
      <div className="App flex h-screen bg-gray-100">
        <Sidebar />
        <div className="main-content flex-1">
          <Home />
        </div>
      </div>
    </>
  )
}

export default App;
