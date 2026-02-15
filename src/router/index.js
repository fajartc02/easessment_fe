import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [{
  path: '/',
  name: 'Home',
  component: DefaultLayout,
  redirect: '/dashboard',
  children: [{
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import('@/views/dashboard/MainDashboard.vue'),
  }, {
    path: '/today-activities',
    name: 'TodayActivities',
    component: () =>
      import('@/views/dashboard/TodayActivities.vue'),
  },
  {
    path: '/history-time-4s',
    name: 'HistoryTime4s',
    component: () =>
      import('@/views/dashboard/HistoryTime4s.vue'),
  }, {
    path: '/calendar',
    name: 'CalendarPlanning',
    component: () =>
      import('@/views/CalendarPlanning/CalendarPlanning.vue'),
  },
  // {
  //     path: '/',
  //     name: 'Dashboard',
  //     component: () =>
  //         import ('@/views/dashboard/MainDashboard.vue'),
  // },
  {
    path: '/history/observation',
    name: 'HistoryObservation',
    component: () =>
      import('@/views/observations/HistoryObservation.vue'),
  },
  {
    path: '/schedule/observation',
    name: 'ScheduleObservation',
    component: () =>
      import('@/views/observations/ScheduleObservation.vue'),
  }, {
    path: '/schedule/observation/form',
    name: 'ScheduleObservationForm',
    component: () =>
      import('@/views/observations/ScheduleObservationForm.vue'),
  }, {
    path: '/schedule/observation/new-form',
    name: 'ScheduleObservationNewForm',
    component: () =>
      import('@/views/observations/new/ScheduleObservationNewForm.vue'),
  }, {
    path: '/observation/:id',
    name: 'DetailObservation',
    component: () =>
      import('@/views/observations/DetailObservation.vue'),
  }, {
    path: '/new-observation/:id',
    name: 'NewDetailObservation',
    component: () =>
      import('@/views/observations/new/NewDetailObservation.vue'),
  }, {
    path: '/observation/report/:id',
    name: 'ReportObservation',
    component: () =>
      import('@/views/observations/ReportObservation.vue'),
  }, {
    path: '/master/pos',
    name: 'Pos',
    component: () =>
      import('@/views/master/Pos/Pos.vue'),
  }, {
    path: '/master/pos/form',
    name: 'FormPos',
    component: () =>
      import('@/views/master/Pos/FormPos.vue'),
  }, {
    path: '/master/job',
    name: 'Job',
    component: () =>
      import('@/views/master/Job/Job.vue'),
  }, {
    path: '/master/job/form',
    name: 'FormJob',
    component: () =>
      import('@/views/master/Job/FormJob.vue'),
  }, {
    path: '/master/shop',
    name: 'Shop',
    component: () =>
      import('@/views/master/Shops/Shops.vue'),
  }, {
    path: '/master/shop/form',
    name: 'FormShop',
    component: () =>
      import('@/views/master/Shops/FormShop.vue'),
  }, {
    path: '/master/plant',
    name: 'Plants',
    component: () =>
      import('@/views/master/Plants/Plants.vue'),
  }, {
    path: '/master/user',
    name: 'Users',
    component: () =>
      import('@/views/master/Users/Users.vue'),
  }, {
    path: '/master/user/form',
    name: 'FormUser',
    component: () =>
      import('@/views/master/Users/FormUser.vue'),
  }, {
    path: '/master/company',
    name: 'Company',
    component: () =>
      import('@/views/master/Company/Company.vue'),
  }, {
    path: '/master/line',
    name: 'Lines',
    component: () =>
      import('@/views/master/Lines/Lines.vue'),
  }, {
    path: '/master/line/form',
    name: 'FormLine',
    component: () =>
      import('@/views/master/Lines/FormLine.vue'),
  }, {
    path: '/master/machine',
    name: 'Machine',
    component: () =>
      import('@/views/master/Machine/Machine.vue'),
  }, {
    path: '/master/periodic-schedule',
    name: 'PeriodicSchedule',
    component: () =>
      import('@/views/master/PeriodicSchedule.vue'),
  }, {
    path: '/master/machine/form',
    name: 'FormMachine',
    component: () =>
      import('@/views/master/Machine/FormMachine.vue'),
  },
  {
    path: '/master/wras',
    name: 'Wras',
    component: () =>
      import('@/views/master/Wras/wras.vue'),
  },

  {
    path: '/stw/dashboard',
    name: 'STW Dashboard',
    component: () =>
      import('@/views/observations/stw/StwDashboard.vue'),
  },
  {
    path: '/stw/list-temuan',
    name: 'List Temuan',
    component: () =>
      import('@/views/observations/stw/ListTemuan.vue'),
  },
  // {
  //   path: '/stw/yamazumi',
  //   name: 'YamazumiScreen',
  //   component: () =>
  //     import('@/views/observations/stw/YamazumiScreen.vue'),
  // },
  {
    path: '/stw/list-temuan/add',
    name: 'List Temuan Add',
    component: () =>
      import('@/views/observations/stw/ListTemuanAdd.vue'),
  },
  {
    path: '/stw/member',
    name: 'STW Member',
    component: () =>
      import('@/views/master/Machine/FormMachine.vue'),
  },
  {
    path: '/stw/focus-theme',
    name: 'STW Fokus Tema',
    component: () =>
      import('@/views/observations/stw/FocusTheme.vue'),
  },
  // 4S
  {
    path: '/4s/main-schedule',
    name: '4S Main Schedule',
    component: () =>
      import('@/views/observations/4s/MainSchedule.vue'),
  },
  {
    path: '/4s/schedule-check/:mainScheduleID/:subScheduleID',
    name: 'Schedule Check',
    component: () =>
      import('@/views/observations/4s/ScheduleCheck.vue'),
  },
  {
    path: '/4s/kanban',
    name: 'Kanban4S',
    component: () =>
      import('@/views/master/4S/Kanban4s.vue'),
  },
  {
    path: '/master/kanban',
    name: 'Kanban4s',
    component: () =>
      import('@/views/master/4S/Kanban4s.vue'),
  },
  {
    path: '/master/zone',
    name: 'Zone4S',
    component: () =>
      import('@/views/master/4S/Zone4S.vue'),
  },
  {
    path: '/4s/temuan',
    name: 'Temuan4S',
    component: () =>
      import('@/views/observations/4s/Temuan4S.vue'),
  },
  {
    path: '/4s/grafik',
    name: 'Grafik4S',
    component: () =>
      import('@/views/observations/4s/Grafik4S.vue'),
  },

  // OM
  {
    path: '/om/main-schedule',
    name: 'MainScheduleOM',
    component: () =>
      import('@/views/observations/om/MainScheduleOM.vue'),
  },
  {
    path: '/om/temuan',
    name: 'OmTemuan',
    component: () =>
      import('@/views/observations/om/OmTemuan.vue'),
  },
  {
    path: '/stw/member-voice',
    name: 'MemberVoice',
    redirect: '/stw/member-voice',
    children: [{
      path: '/stw/member-voice',
      component: () =>
        import('@/views/observations/stw/MemberVoice.vue'),
    },
    {
      path: '/stw/member-voice/add',
      name: 'MemberVoiceAdd',
      component: () =>
        import('@/views/observations/stw/MemberVoiceAdd.vue'),
    },
    ]
  },
  {
    path: '/stw/henkaten',
    name: 'STW Henkaten',
    component: () =>
      import('@/views/observations/stw/Henkaten.vue'),
  },
  // OM
  {
    path: '/master/om-item-check-kanban',
    name: 'Item Check Kanban OM',
    component: () =>
      import('@/views/observations/om/OmItemCheckKanban.vue'),
  },
  {
    path: '/om/schedule-detail/:mainScheduleID/:subScheduleID',
    name: 'Schedule Detail OM',
    component: () =>
      import('@/views/observations/om/ScheduleDetailOm.vue'),
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
      import('@/views/pages/Page404'),
  },
  {
    path: '500',
    name: 'Page500',
    component: () =>
      import('@/views/pages/Page500'),
  },
  {
    path: 'login',
    name: 'Login',
    component: () =>
      import('@/views/pages/Login'),
  },
  {
    path: 'register',
    name: 'Register',
    component: () =>
      import('@/views/pages/Register'),
  },
  ],
},
{
  path: '/login',
  name: 'Login',
  component: () =>
    import( /* webpackChunkName: "login" */ '@/views/auth/Login'),
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
