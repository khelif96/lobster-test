import { Routes, Route, Link } from "react-router-dom";
import Loader from "./Loader";
import LogView from "./LogView";
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route path="logs" element={<LogView />} />
      </Routes>
  )
}

export default App;