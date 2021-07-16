import Vue from 'vue'
import VueRouter from 'vue-router'
import China from '../views/China.vue'
import World from '../views/World.vue'
import History from '../views/History.vue'
import Knowledge from '../views/Knowledge.vue'
import Comments from '../views/Comments.vue'
import News from '../views/News.vue'
import Traffic from '../views/Traffic.vue'
import UserMessage from '../views/UserMessage.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/china' },
    {
        path: '/china',
        name: 'china',
        component: China,
    },
    {
        path: '/world',
        name: 'world',
        component: World
    },
    {
        path: '/history',
        name: 'history',
        component: History
    },
    {
        path: '/knowledge',
        name: 'knowledge',
        component: Knowledge
    },
    {
        path: '/comments/:CID',
        name: 'comments',
        component: Comments
    },
    {
        path: '/news',
        name: 'news',
        component: News
    },
    {
        path: '/traffic',
        name: 'traffic',
        component: Traffic
    },
    {
        path: '/profile',
        name: 'profile',
        component: UserMessage
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router