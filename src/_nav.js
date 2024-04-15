export default [{
        component: 'CNavTitle', // --- HISTORY MENU
        name: 'Main Dashboard',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/',
        icon: 'cil-speedometer',
        is_admin: false
    },
    {
        component: 'CNavTitle', // --- HISTORY MENU
        name: 'STW',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Dashboard STW',
        to: '/stw/dashboard',
        icon: 'cil-speedometer',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'List Temuan',
        to: '/stw/list-temuan',
        icon: 'cil-file',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Member Voice',
        to: '/stw/member-voice',
        icon: 'cil-people',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Fokus Tema',
        to: '/stw/focus-theme',
        icon: 'cil-clipboard',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Henkaten',
        to: '/stw/henkaten',
        icon: 'cil-clipboard',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Observasi history',
        to: '/history/observation',
        icon: 'cil-clipboard',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Schedule Observasi',
        to: '/schedule/observation',
        icon: 'cil-clipboard',
        is_admin: false
    },
    {
        component: 'CNavTitle', // --- 4S MENU
        name: '4S',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Main Schedule 4S',
        to: '/4s/main-schedule',
        icon: 'cil-speedometer',
        is_admin: false
    },
    // {
    //     component: 'CNavItem',
    //     name: 'Kanban 4S',
    //     to: '/4s/kanban',
    //     icon: 'cil-speedometer'
    // },
    {
        component: 'CNavItem',
        name: 'Temuan 4S',
        to: '/4s/temuan',
        icon: 'cil-speedometer',
        is_admin: false
    },
    // {
    //     component: 'CNavItem',
    //     name: 'Grafik 4S',
    //     to: '/4s/grafik',
    //     icon: 'cil-speedometer'
    // },

    {
        component: 'CNavTitle', // --- OM MENU
        name: 'OM',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Main Schedule OM',
        to: '/om/main-schedule',
        icon: 'cil-speedometer',
        is_admin: false
    },
    {
        component: 'CNavItem',
        name: 'Temuan OM',
        to: '/om/temuan',
        icon: 'cil-speedometer',
        is_admin: false
    },
    {
        component: 'CNavTitle', // --- MASTER MENU
        name: 'Master Data',
        is_admin: true
    },
    {
        component: 'CNavItem',
        name: 'Kanban 4S',
        to: '/master/kanban',
        icon: 'cil-clipboard',
        is_admin: true
    },
    {
        component: 'CNavItem',
        name: 'Item Check Kanban OM',
        to: '/master/om-item-check-kanban',
        icon: 'cil-clipboard',
        is_admin: true
    },
    {
        component: 'CNavGroup',
        name: 'Master STW',
        icon: 'cil-clipboard',
        is_admin: true,
        items: [{
                component: 'CNavItem',
                name: 'Pos',
                to: '/master/pos',
                is_admin: true
            },
            {
                component: 'CNavItem',
                name: 'Job',
                to: '/master/job',
                is_admin: true
            },
        ]
    },
    {
        component: 'CNavGroup',
        name: 'Locations',
        icon: 'cil-building',
        is_admin: true,
        items: [{
                component: 'CNavItem',
                name: 'Company',
                to: '/master/company',
                is_admin: true
            },
            {
                component: 'CNavItem',
                name: 'Plant',
                to: '/master/plant',
                is_admin: true
                    // icon: 'cil-factory',
            },
            {
                component: 'CNavItem',
                name: 'Shop',
                to: '/master/shop',
                is_admin: true
                    // icon: 'cil-double-quote-sans-right',
            },
            {
                component: 'CNavItem',
                name: 'Line',
                to: '/master/line',
                is_admin: true
                    // icon: 'cil-border-all',
            },
            {
                component: 'CNavItem',
                name: 'Machine',
                to: '/master/machine',
                is_admin: true
                    // icon: 'cil-border-all',
            },
        ]
    },
    {
        component: 'CNavGroup',
        name: 'Commons',
        icon: 'cil-clipboard',
        items: [{
                component: 'CNavItem',
                name: 'Planning Shift',
                to: '/calendar',
                is_admin: true
            },
            {
                component: 'CNavItem',
                name: 'Periodic Schedule',
                is_admin: true,
                to: '/master/periodic-schedule',
            },
            {
                component: 'CNavItem',
                name: 'Users',
                to: '/master/user',
                is_admin: true
            },
        ]
    },
]