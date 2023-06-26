import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [{
        path: '/',
        name: 'Home',
        component: DefaultLayout,
        redirect: '/',
        children: [{
                path: '/',
                name: 'Dashboard',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import ('@/views/Dashboard.vue'),
            },
            {
                path: '/schedule/observation',
                name: 'ScheduleObservation',
                component: () =>
                    import ('@/views/observations/ScheduleObservation.vue'),
            }, {
                path: '/schedule/observation/form',
                name: 'ScheduleObservationForm',
                component: () =>
                    import ('@/views/observations/ScheduleObservationForm.vue'),
            }, {
                path: '/observation/:id',
                name: 'DetailObservation',
                component: () =>
                    import ('@/views/observations/DetailObservation.vue'),
            }, {
                path: '/observation/report/:id',
                name: 'ReportObservation',
                component: () =>
                    import ('@/views/observations/ReportObservation.vue'),
            }, {
                path: '/master/pos',
                name: 'Pos',
                component: () =>
                    import ('@/views/master/Pos/Pos.vue'),
            }, {
                path: '/master/pos/form',
                name: 'FormPos',
                component: () =>
                    import ('@/views/master/Pos/FormPos.vue'),
            }, {
                path: '/master/job',
                name: 'Job',
                component: () =>
                    import ('@/views/master/Job/Job.vue'),
            }, {
                path: '/master/job/form',
                name: 'FormJob',
                component: () =>
                    import ('@/views/master/Job/FormJob.vue'),
            },
        ],
    },

    {
        path: '/pages',
        redirect: '/pages/404',
        name: 'Pages',
        component: {
            render() {
                return h(resolveComponent('router-view'))
            },
        },
        children: [{
                path: '404',
                name: 'Page404',
                component: () =>
                    import ('@/views/pages/Page404'),
            },
            {
                path: '500',
                name: 'Page500',
                component: () =>
                    import ('@/views/pages/Page500'),
            },
            {
                path: 'login',
                name: 'Login',
                component: () =>
                    import ('@/views/pages/Login'),
            },
            {
                path: 'register',
                name: 'Register',
                component: () =>
                    import ('@/views/pages/Register'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ( /* webpackChunkName: "login" */ '@/views/auth/Login'),
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
})

export default router