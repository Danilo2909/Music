import PostCard from '../components/PostCard.jsx'
export default { title: 'MusiGram/PostCard', component: PostCard }
const post = { id:'1', caption:'Demo #story', audioUrl:'/audio.mp3', coverUrl:'', createdAt:Date.now(), likeCount:3, commentCount:1 }
export const Basic = { args: { post } }
