// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import useTokenExpiration from './hook/useTokenExpiration';

// import LoginPage from './component/LoginPage';
// import HomePage from './page/Home/HomePage';
// import { useAuthContext } from './hook/useAuthContext';

// import Bom from './page/Bom/Bom';
// import CreateBomExcel from './page/Bom/CreateBomExcel'
// import CreateBom from './page/Bom/CreateBom'
// import EditBom from './page/Bom/EditBom';


// import Fg from './page/Fg/Fg'
// import CreateFgExcel from './page/Fg/CreateFgExcel';
// import EditFg from './page/Fg/EditFg';
// import CreateFg from './page/Fg/CreateFg'

// import Wip from './page/Wip/Wip'
// import EditWip from './page/Wip/EditWip';
// import CreateWipExcel from './page/Wip/CreateWipExcel';
// import CreateWip from './page/Wip/CreateWip';

// import Dr from './page/Dr/Dr'
// import CreateDrExcel from './page/Dr/CreateDrExcel';
// import EditDr from './page/Dr/EditDr';
// import CreateDrill from './page/Dr/CreateDr';


// import User from './page/User/User';
// import CreateUser from './page/User/CreateUser';

// import Dashboard from './page/Dash/Dashboard';

// import { Layout } from 'antd';
// import Sidebar from './component/Sidebar';
// import HeaderComponent from './component/Header';
// import FooterComponent from './component/Footer';
// import React, { useState } from 'react';

// const { Content } = Layout;

// const App = () => {
//   useTokenExpiration(); // Hook to handle token expiration
//   const { user } = useAuthContext(); // Retrieve user context
//   const isAuthenticated = Boolean(user && user.token);
  
//   console.log('App user:', user);
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <>

//       <Layout style={{ minHeight: '100vh' }}>
//         <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
//         <Layout>
//           <HeaderComponent/>
//           <Content
//             style={{
//               margin: '24px 16px 0',
//               padding: '24px',
//               background: '#ffffff',
//               borderRadius: '4px',
//               boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             <div>
//               <Route path='/home' element={isAuthenticated ? <HomePage /> : <Navigate to='/login' />} />
//             </div>
//           </Content>
//           <FooterComponent />
//         </Layout>
//       </Layout>

    

      // <Router>
      //   <Routes>

      //     {/* Redirect to /home if authenticated; otherwise, show LoginPage */}
          
      //     <Route path='/login' element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />} />

      //     <Route path='/' element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />} />
          
      //     {/* Protected routes */}
      //     {/* bom */}
      //     <Route path='/home' element={isAuthenticated ? <HomePage /> : <Navigate to='/login' />} />

      //     <Route path='/bom' element={isAuthenticated ? <Bom /> : <Navigate to='/login' />} />

      //     <Route path ='/bom/:id' element={isAuthenticated ? <EditBom /> : <Navigate to='/login' />} />

      //     <Route path='/createbomexcel' element={isAuthenticated ? <CreateBomExcel /> : <Navigate to='/login' />} />

      //     <Route path='/createbom' element={isAuthenticated ? <CreateBom /> : <Navigate to='/login' />} />
      //     {/* fg */}
      //     <Route path='/fg' element={isAuthenticated ? <Fg /> : <Navigate to='/login'/>}/>

      //     <Route path='/fg/:id' element={isAuthenticated ? <EditFg/> : <Navigate to="/login"/>} />

      //     <Route path='/createfgexcel' element={isAuthenticated ? <CreateFgExcel/> : <Navigate to="/login"/>} />

      //     <Route path='/createfg' element={isAuthenticated ? <CreateFg/>: <Navigate to="/login" />}/>
          

      //     <Route path='/wip' element={isAuthenticated ? <Wip /> : <Navigate to='/login'/>}/>

      //     <Route path='/wip/:id' element={isAuthenticated ? <EditWip /> : <Navigate to='/login'/>}/>

        
      //     <Route path='/createwip' element={isAuthenticated ? <CreateWip /> : <Navigate to='/login'/>}/>

      //     <Route path='/createwipexcel' element={isAuthenticated ? <CreateWipExcel /> : <Navigate to='/login'/>}/>

      //     <Route path='/dr' element={isAuthenticated ? <Dr /> : <Navigate to='/login' />} />

      //     <Route path='/dr/:id' element={isAuthenticated ? <EditDr /> : <Navigate to='/login' />} />

      //     <Route path='/createdrexcel' element={isAuthenticated ? <CreateDrExcel /> : <Navigate to='/login' />} />

      //     <Route path='/createdr' element={isAuthenticated ? < CreateDrill /> : <Navigate to='/login' />} />



      //     <Route path='/user' element={isAuthenticated ? < User /> : <Navigate to='/login' />} />
          
      //     <Route path='/createuser' element={isAuthenticated ? < CreateUser /> : <Navigate to='/login' />} />

      //     <Route path='/dashboard' element={isAuthenticated ? < Dashboard /> : <Navigate to='/login' />} />
          
      //     {/* Optional: Add a route for a 404 page */}
      //     {/* <Route path='*' element={<NotFoundPage />} /> */}
      //   </Routes>
      // </Router>
    

//     </>
//   );
// };

// export default App;




import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import useTokenExpiration from './hook/useTokenExpiration';
import { useAuthContext } from './hook/useAuthContext';

import Sidebar from './component/Sidebar'; // Sidebar outside of Routes
import LoginPage from './component/LoginPage';
import HomePage from './page/Home/HomePage';
import Bom from './page/Bom/Bom';
import CreateBomExcel from './page/Bom/CreateBomExcel';
import CreateBom from './page/Bom/CreateBom';
import EditBom from './page/Bom/EditBom';
import Fg from './page/Fg/Fg';
import CreateFgExcel from './page/Fg/CreateFgExcel';
import EditFg from './page/Fg/EditFg';
import CreateFg from './page/Fg/CreateFg';
import Wip from './page/Wip/Wip';
import EditWip from './page/Wip/EditWip';
import CreateWipExcel from './page/Wip/CreateWipExcel';
import CreateWip from './page/Wip/CreateWip';
import Dr from './page/Dr/Dr';
import CreateDrExcel from './page/Dr/CreateDrExcel';
import EditDr from './page/Dr/EditDr';
import CreateDrill from './page/Dr/CreateDr';
import User from './page/User/User';
import CreateUser from './page/User/CreateUser';
import Dashboard from './page/Dash/Dashboard';
import HeaderComponent from './component/Header';
import FooterComponent from './component/Footer';

import DrawingTable from './page/Drawing/DrawingTable';
import CreateDrawing from "./page/Drawing/CreateDrawing"
import EditDrawing from './page/Drawing/EditDrawing';

import Staticmain from './page/static/Staticmain';
import { Layout } from 'antd';
const { Content } = Layout;

const App = () => {
  useTokenExpiration();
  const { user } = useAuthContext();
  const isAuthenticated = Boolean(user && user.token);
  const [collapsed, setCollapsed] = useState(false);

  console.log("user", user)
  console.log("isAuthenticated", isAuthenticated)
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar placed outside the Routes */}
        <Sidebar collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}/>
        <Layout>
          <HeaderComponent />
          <Content style={{
              margin: '24px 16px 0',
              padding: '24px',
              background: '#ffffff',
              borderRadius: '4px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}>

           
            <Routes>

              {/* Redirect to /home if authenticated; otherwise, show LoginPage */}
              
              <Route path='/login' element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />} />

              <Route path='/' element={isAuthenticated ? <Navigate to='/home' /> : <LoginPage />} />
              
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
              

              <Route path='/wip' element={isAuthenticated ? <Wip /> : <Navigate to='/login'/>}/>

              <Route path='/wip/:id' element={isAuthenticated ? <EditWip /> : <Navigate to='/login'/>}/>

            
              <Route path='/createwip' element={isAuthenticated ? <CreateWip /> : <Navigate to='/login'/>}/>

              <Route path='/createwipexcel' element={isAuthenticated ? <CreateWipExcel /> : <Navigate to='/login'/>}/>

              <Route path='/dr' element={isAuthenticated ? <Dr /> : <Navigate to='/login' />} />

              <Route path='/dr/:id' element={isAuthenticated ? <EditDr /> : <Navigate to='/login' />} />

              <Route path='/createdrexcel' element={isAuthenticated ? <CreateDrExcel /> : <Navigate to='/login' />} />

              <Route path='/createdr' element={isAuthenticated ? < CreateDrill /> : <Navigate to='/login' />} />



              <Route path='/user' element={isAuthenticated ? < User /> : <Navigate to='/login' />} />
              
              <Route path='/createuser' element={isAuthenticated ? < CreateUser /> : <Navigate to='/login' />} />

              <Route path='/Product-Data' element={isAuthenticated ? < Dashboard /> : <Navigate to='/login' />} />

              <Route path='/drawing' element={isAuthenticated ? < DrawingTable /> : <Navigate to='/login' />} />

              <Route path='/createdrawing' element={isAuthenticated ? < CreateDrawing /> : <Navigate to='/login' />} />

              <Route path='/drawing/:id' element={isAuthenticated ? < EditDrawing /> : <Navigate to='/login' />} />

              <Route path='/static' element={isAuthenticated ? < Staticmain /> : <Navigate to='/login' />} />

              
              
            </Routes>
          </Content>
          <FooterComponent />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;

