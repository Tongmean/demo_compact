import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bom from './page/Bom/Bom';
import LoginPage from './component/LoginPage';
import HomePage from './page/HomePage';
import { useAuthContext } from './hook/useAuthContext';
import CreateBomExcel from './page/Bom/CreateBomExcel'
import CreateBom from './page/Bom/CreateBom'
import Dr from './page/Dr/Dr'
import EditBom from './page/Bom/EditBom';
import useTokenExpiration from './hook/useTokenExpiration';
const App = () => {
  useTokenExpiration(); // Hook to handle token expiration
  const { user } = useAuthContext(); // Retrieve user context
  const isAuthenticated = Boolean(user && user.token);
  
  console.log('App user:', user);
  console.log('Is authenticated:', isAuthenticated);
  return (
    <Router>
      <Routes>
        {/* Redirect to /home if authenticated; otherwise, show LoginPage */}
        <Route path='/' element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />} />
        
        {/* Protected routes */}
        <Route path='/home' element={isAuthenticated ? <HomePage /> : <Navigate to='/' />} />

        <Route path='/bom' element={isAuthenticated ? <Bom /> : <Navigate to='/' />} />

        <Route path ='/bom/:id' element={isAuthenticated ? <EditBom /> : <Navigate to='/' />} />

        <Route path='/createbomexcel' element={isAuthenticated ? <CreateBomExcel /> : <Navigate to='/' />} />

        <Route path='/createbom' element={isAuthenticated ? <CreateBom /> : <Navigate to='/' />} />



        <Route path='/dr' element={isAuthenticated ? <Dr /> : <Navigate to='/' />} />


        
        {/* Optional: Add a route for a 404 page */}
        {/* <Route path='*' element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
