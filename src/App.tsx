import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import QuestionPage from './pages/QuestionPage';
import QuestionResultPage from './pages/QuestionResultPage';
import PlaylistResult from './pages/MakePlayListPage';
import ReviewPage from "./pages/ReviewPage.tsx";
import SharePage from './pages/SharePage.tsx';
import PlayListResultPage from './pages/PlayListResultPage.tsx';
import PlayListExchangePage from './pages/PlayListExchangePage.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path='/question' element={<QuestionPage />} />
                <Route path='/result' element={<QuestionResultPage />} />
                <Route path='/make-playlist' element={<PlaylistResult />} />
                <Route path='/review' element={<ReviewPage />} />
                <Route path='/share' element={<SharePage/>} />
                <Route path='/play-list-complete' element={<PlayListResultPage/>} />
                <Route path='/play-list-exchange' element={<PlayListExchangePage/>} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;

