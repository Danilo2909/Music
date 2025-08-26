import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import NavBar from './components/NavBar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Feed from './pages/Feed.jsx'
import Upload from './pages/Upload.jsx'
import Explore from './pages/Explore.jsx'
import DMInbox from './pages/DMInbox.jsx'
import DMChat from './pages/DMChat.jsx'
import StoryFeed from './pages/StoryFeed.jsx'
import SavesPage from './pages/SavesPage.jsx'
import PlaylistsPage from './pages/PlaylistsPage.jsx'
import Support from './pages/Support.jsx'
import Subscribe from './pages/Subscribe.jsx'
import AdsManager from './pages/AdsManager.jsx'
import Admin from './pages/Admin.jsx'
import Profile from './pages/Profile.jsx'

function Private({ children }){ const { user } = useAuth(); return user?children:<Navigate to="/login" replace /> }

export default function App(){
  return (<AuthProvider>
    <NavBar />
    <div className="container-app px-3 py-4">
      <Routes>
        <Route path="/" element={<Private><Feed/></Private>} />
        <Route path="/upload" element={<Private><Upload/></Private>} />
        <Route path="/explore" element={<Private><Explore/></Private>} />
        <Route path="/u/:username" element={<Private><Profile/></Private>} />
        <Route path="/dm" element={<Private><DMInbox/></Private>} />
        <Route path="/dm/:conversationId" element={<Private><DMChat/></Private>} />
        <Route path="/stories" element={<Private><StoryFeed/></Private>} />
        <Route path="/saves" element={<Private><SavesPage/></Private>} />
        <Route path="/playlists" element={<Private><PlaylistsPage/></Private>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
              <Route path="/admin" element={<Private><Admin/></Private>} />
        <Route path="/support" element={<Private><Support/></Private>} />
        <Route path="/pro" element={<Private><Subscribe/></Private>} />
        <Route path="/admin/ads" element={<Private><AdsManager/></Private>} />
      </Routes>
    </div>
  </AuthProvider>)
}
