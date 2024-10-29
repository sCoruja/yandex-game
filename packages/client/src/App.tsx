import "./App.css";
import { Route, Routes } from "react-router-dom";
import {
    ForumPage,
    GamePage,
    LeaderboardPage,
    LoginPage,
    MainPage,
    ProfilePage,
    RegisterPage,
    TopicPage,
} from "./pages/";
import { Layout } from "./components";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/forum/:id" element={<TopicPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
