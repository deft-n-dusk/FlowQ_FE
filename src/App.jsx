import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DLQPage from "./pages/DLQPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/dlq"
          element={<DLQPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;