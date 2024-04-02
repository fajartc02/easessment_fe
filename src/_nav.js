export default [{
        component: 'CNavTitle', // --- HISTORY MENU
        name: 'Main Dashboard',
    },
    {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/',
        icon: 'cil-speedometer'
    },
    {
        component: 'CNavTitle', // --- HISTORY MENU
        name: 'STW',
    },
    {
        component: 'CNavItem',
        name: 'Dashboard STW',
        to: '/stw/dashboard',
        icon: 'cil-speedometer'
    },
    {
        component: 'CNavItem',
        name: 'List Temuan',
        to: '/stw/list-temuan',
        icon: 'cil-file'
    },
    {
        component: 'CNavItem',
        name: 'Member Voice',
        to: '/stw/member-voice',
        icon: 'cil-people'
    },
    {
        component: 'CNavItem',
        name: 'Fokus Tema',
        to: '/stw/focus-theme',
        icon: 'cil-clipboard'
    },
    {
        component: 'CNavItem',
        name: 'Henkaten',
        to: '/stw/henkaten',
        icon: 'cil-clipboard'
    },
    {
        component: 'CNavItem',
        name: 'Observasi history',
        to: '/history/observation',
        icon: 'cil-clipboard',
    },
    {
        component: 'CNavItem',
        name: 'Schedule Observasi',
        to: '/schedule/observation',
        icon: 'cil-clipboard',
    },
    {
        component: 'CNavTitle', // --- HISTORY MENU
        name: '4S',
    },
    {
        component: 'CNavItem',
        name: 'Main Schedule',
        to: '/4s/main-schedule',
        icon: 'cil-speedometer'
    },
    {
        component: 'CNavTitle', // --- MASTER MENU
        name: 'Master Data',
    },
    {
        component: 'CNavGroup',
        name: 'Locations',
        icon: 'cil-building',
        items: [{
                component: 'CNavItem',
                name: 'Company',
                to: '/master/company',
            },
            {
                component: 'CNavItem',
                name: 'Plant',
                to: '/master/plant',
                // icon: 'cil-factory',
            },
            {
                component: 'CNavItem',
                name: 'Shop',
                to: '/master/shop',
                // icon: 'cil-double-quote-sans-right',
            },
            {
                component: 'CNavItem',
                name: 'Line',
                to: '/master/line',
                // icon: 'cil-border-all',
            },
            {
                component: 'CNavItem',
                name: 'Machine',
                to: '/master/machine',
                // icon: 'cil-border-all',
            },
        ]
    },
    {
        component: 'CNavItem',
        name: 'Kanban Itemcheck',
        to: '/master/kanban',
        icon: 'cil-clipboard',
    },
    {
        component: 'CNavItem',
        name: 'Planning Shift',
        to: '/calendar',
        icon: 'cil-calendar',
    },
    {
        component: 'CNavItem',
        name: 'Users',
        to: '/master/user',
        icon: 'cil-user',
    },
    {
        component: 'CNavItem',
        name: 'Pos',
        to: '/master/pos',
        icon: 'cil-border-all',
    },
    {
        component: 'CNavItem',
        name: 'Job',
        to: '/master/job',
        icon: 'cil-puzzle',
    },
]
