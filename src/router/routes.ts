const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/Home.vue'),
  // },
  {
    // path: '/bigDataEchart',
    path: '/BigDataEchart',
    name: 'BigDataEchart',
    component: () => import('@/views/bigDataEchart/index.vue'),
  },
  {
    path: '/',
    name: 'MoreEchart',
    component: () => import('@/views/moreEchart/index.vue'),
  },
]

export default routes
