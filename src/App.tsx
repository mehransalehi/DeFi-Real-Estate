import { Routes, Route } from "react-router-dom";
import MyOffers from "./MyOffers";
import HomePage from "./HomePage"; // move your current App code into HomePage.tsx

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/offers" element={<MyOffers />} />
    </Routes>
  );
}

export default App;