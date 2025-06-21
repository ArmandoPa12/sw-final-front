import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import Dashboard from '@/views/Dashboard.vue'
import RegisterView from '@/views/RegisterView.vue'
import TextEdito from '@/views/TextEditor.vue'
import CanvasDrawer from '@/views/CanvasDrawer.vue'
import Notas from '@/views/Notas.vue'
import Suscriber from '@/views/Suscriber.vue'
import Payment from '@/views/Payment.vue'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },
        {
            path: '/editor',
            name: 'editor',
            component: TextEdito,
        },
        {
            path: '/draw',
            name: 'draw',
            component: CanvasDrawer,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: { requiresAuth: true },
            children: [{
                    path: '/',
                    redirect: '/dashboard'
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () =>
                        import ('../views/AboutView.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/notas/:id',
                    name: 'notas',
                    component: Notas,
                },
                {
                    path: '/suscripcion',
                    name: 'suscripcion',
                    component: Suscriber,
                },
                {
                    path: '/payment',
                    name: 'paymente',
                    component: Payment,
                },
            ]
        },

    ],
})


router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    auth.init()

    if (to.meta.requiresAuth && !auth.isAuthenticated()) {
        next('/login')
    } else {
        next()
    }
})

export default router