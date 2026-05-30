import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import ComponentShowcase from './pages/ComponentShowcase';
import ShadowingLabPage from './pages/ShadowingLabPage';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload/:subjectId" element={<UploadPage />} />
          <Route path="/analysis/:subjectId" element={<AnalysisPage />} />
          <Route path="/results/:subjectId/:resultId?" element={<ResultsPage />} />
          <Route path="/showcase" element={<ComponentShowcase />} />
          <Route path="/shadowing" element={<ShadowingLabPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
