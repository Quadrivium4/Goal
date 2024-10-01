import { createBrowserRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
import Goals from './pages/Goals/Goals';
import Stats from './pages/Stats/Stats';
import Settings from './pages/Settings';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

const appRouter = createBrowserRouter([{
    path: "/",
    element: <Goals />
},{
    path: "/stats",
    element: <Stats />
},{
    path: "/settings",
    element: <Settings />
}]);
const AppNavigator = () =>{
    const {mode} = useAuth()
    return (
        <>
        <div>{mode}</div>
        <BrowserRouter>
        <Routes>
        <Route path='/' element={<Goals />}></Route>
        <Route path='/stats' element={<Stats />}></Route>
        <Route path='/settings' element={<Settings/>}></Route>
        </Routes>
        <Footer></Footer>
        </BrowserRouter>
       
        </>
        
    )
}
export default AppNavigator