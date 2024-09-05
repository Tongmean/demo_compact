import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bom from './page/Bom/Bom';
import Fg from './page/Fg/Fg'
import LoginPage from './component/LoginPage';
import HomePage from './page/HomePage';
import { useAuthContext } from './hook/useAuthContext';
import CreateBomExcel from './page/Bom/CreateBomExcel'
import CreateBom from './page/Bom/CreateBom'
import CreateFgExcel from './page/Fg/CreateFgExcel';
import Dr from './page/Dr/Dr'
import EditBom from './page/Bom/EditBom';
import EditFg from './page/Fg/EditFg';
import useTokenExpiration from './hook/useTokenExpiration';
import CreateFg from './page/Fg/CreateFg'



const App = () => {
  useTokenExpiration(); // Hook to handle token expiration
  const { user } = useAuthContext(); // Retrieve user context
  const isAuthenticated = Boolean(user && user.token);
  
  console.log('App user:', user);
  return (
    <Router>
      <Routes>

        {/* Redirect to /home if authenticated; otherwise, show LoginPage */}
        
        <Route path='/login' element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />} />
        
        {/* Protected routes */}
        {/* bom */}
        <Route path='/home' element={isAuthenticated ? <HomePage /> : <Navigate to='/login' />} />

        <Route path='/bom' element={isAuthenticated ? <Bom /> : <Navigate to='/login' />} />

        <Route path ='/bom/:id' element={isAuthenticated ? <EditBom /> : <Navigate to='/login' />} />

        <Route path='/createbomexcel' element={isAuthenticated ? <CreateBomExcel /> : <Navigate to='/login' />} />

        <Route path='/createbom' element={isAuthenticated ? <CreateBom /> : <Navigate to='/login' />} />
        {/* fg */}
        <Route path='/fg' element={isAuthenticated ? <Fg /> : <Navigate to='/login'/>}/>

        <Route path='/fg/:id' element={isAuthenticated ? <EditFg/> : <Navigate to="/login"/>} />

        <Route path='/createfgexcel' element={isAuthenticated ? <CreateFgExcel/> : <Navigate to="/login"/>} />

        <Route path='/createfg' element={isAuthenticated ? <CreateFg/>: <Navigate to="/login" />}/>
        

        <Route path='/dr' element={isAuthenticated ? <Dr /> : <Navigate to='/' />} />
        
        {/* Optional: Add a route for a 404 page */}
        {/* <Route path='*' element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
