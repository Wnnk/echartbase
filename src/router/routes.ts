const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/Home.vue'),
  // },
  {
    // path: '/bigDataEchart',
    path: '/bigDataEchart',
    name: 'BigDataEchart',
    component: () => import('@/views/bigDataEchart/index.vue'),
  },
  {
    path: '/MoreEchart',
    name: 'MoreEchart',
    component: () => import('@/views/moreEchart/index.vue'),
  },
  {
    path: '/realtimeEchart',
    name: 'realtimeEchart',
    component: () => import('@/views/realtimeEchart/index.vue'),
  },
  {
    path: '/form',
    name: 'Form',
    component: () => import('@/views/form/index.vue'),
  },
  {
    path: '/',
    name: 'DynamicForm',
    component: () => import('@/views/dynamicForm/index.vue'),
  },
  {
    path: '/fontSizeEchart',
    name: 'FontSizeEchart',
    component: () => import('@/views/fontSizeEchart/index.vue'),
  },
  {
    path: '/waterMarkEchart',
    name: 'WaterMarkEchart',
    component: () => import('@/views/watermarkEchart/index.vue'),
  },
]

export default routes
