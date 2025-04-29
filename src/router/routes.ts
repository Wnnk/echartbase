const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/Home.vue'),
  // },
  {
    path: '/',
    name: 'TestAbort',
    component: () => import('@/views/test/testAbort.vue'),
  },
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
    path: '/dynamicForm',
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
    component: () => import('@/views/WaterMarkEchart/index.vue'),
  },
  {
    path: '/commonTable',
    name: 'CommonTable',
    component: () => import('@/views/table/CommonTable/commonTable.vue'),
  },
  {
    path: '/commonForm',
    name: 'CommonForm',
    component: () => import('@/views/form/commonForm/commonForm.vue'),
  },
  {
    path: '/cacheForm',
    name: 'cacheForm',
    component: () => import('@/views/form/cacheForm/cacheForm.vue'),
  },
  {
    path: '/paginateTable',
    name: 'PaginateTable',
    component: () => import('@/views/table/PaginateTable/paginateTable.vue'),
  }
]

export default routes
