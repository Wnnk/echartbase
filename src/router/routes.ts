const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/Home.vue'),
  // },
  {
    path: '/testAbort',
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
    path: '/detailDialogTable',
    name: 'detailDialogTable',
    component: () => import('@/views/table/detailDialogTable/detailDialogTable.vue'),
  },
  {
    path: '/editDialogTable',
    name: 'editDialogTable',
    component: () => import('@/views/table/editDialogTable/editDialogTable.vue'),
  },
  {
    path: '/editWithServerDialogTable',
    name: 'editWithServerDialogTable',
    component: () => import('@/views/table/editDialogTable/editWithServerDialogTable.vue'),
  },
  {
    path: '/replaceSelectTable',
    name: 'replaceSelectTable',
    component: () => import('@/views/table/replaceSelectTable/replaceSelectTable.vue'),
  },
  {
    path: '/statusSelect',
    name: 'statusSelect',
    component: () => import('@/views/Select/statusSelect.vue'),
  },
  {
    path: '/idSelect',
    name: 'idSelect',
    component: () => import('@/views/Select/idSelect.vue'),
  },
  {
    path: '/useDialog',
    name: 'useDialog',
    component: () => import('@/views/Dialog/useDialog.vue'),
  },
  {
    path: '/',
    name: 'useTable',
    component: () => import('@/views/table/useTable.vue'),
  },
  {
    path: '/useForm',
    name: 'useForm',
    component: ()=> import("@/views/form/useForm.vue")
  }
]

export default routes
