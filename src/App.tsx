import {Outlet} from 'react-router-dom';
import Footer from './components/Footer';
import './styles/MainLayout.css'; // Новый файл стилей

export default function App() {
    return (
        <div className="app-container">
            <div className="content">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    );
}