import { BrowserRouter as HashRouter } from "react-router-dom";
import { Main } from "./layouts/Main";

function App() {
  return (
    <HashRouter basename="/movie-app/#/">
      <Main />
    </HashRouter>
  );
}

export default App;
