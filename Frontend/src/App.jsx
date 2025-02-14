import './App.css'
import Dashboard from './landing_page/Dashboard/Dashboard';
import Sidebar from './landing_page/includes/Sidebar/Sidebar';

function App() {
  return (
    <>
      <div className="App flex h-screen bg-gray-100">
        <Sidebar />
        <div className="main-content flex-1">
          <Dashboard />
        </div>
      </div>
    </>
  )
}

export default App;
