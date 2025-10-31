import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload/:subjectId" element={<UploadPage />} />
          <Route path="/analysis/:subjectId" element={<AnalysisPage />} />
          <Route path="/results/:subjectId/:resultId?" element={<ResultsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
