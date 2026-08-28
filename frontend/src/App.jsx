import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllRepos from "./pages/AllRepos";
import Deploy from "./pages/Deploy";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/repositories") {
    return <AllRepos />;
  }

    if (path === "/deploy") {
    return <Deploy />;
  }

  return <Login />;
}

export default App;