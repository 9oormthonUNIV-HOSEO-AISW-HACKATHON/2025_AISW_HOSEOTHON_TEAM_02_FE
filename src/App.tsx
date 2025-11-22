import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import QuestionPage from './pages/QuestionPage';
import QuestionResultPage from './pages/QuestionResultPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path='/question' element={<QuestionPage />} />
                <Route path='/result' element={<QuestionResultPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;

