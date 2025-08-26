import NavBar from '../components/NavBar.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
export default { title: 'MusiGram/NavBar', component: NavBar }
export const Default = () => (<AuthProvider><NavBar/></AuthProvider>)
