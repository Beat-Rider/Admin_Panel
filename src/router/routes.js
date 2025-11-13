const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    redirect: '/add',

    children: [
      {
        path: 'add',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: 'Додати Героя' },
      },
      {
        path: 'edit',
        component: () => import('pages/EditPage.vue'),
        meta: { title: 'Редагування Даних' },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
