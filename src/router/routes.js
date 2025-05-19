const routes = [
  {
    path: '/',
    component: () => import('../layouts/functionalTest.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/HomePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'notes',
        name: 'Notes',
        component: () => import('../pages/NotesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'notes/new',
        name: 'NoteNew',
        component: () => import('../pages/NewNotesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'notes/:noteCode',
        name: 'NoteDetail',
        component: () => import('../pages/NotesPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    name: 'Login',
  },
  {
    path: '/test',
    component: () => import('layouts/test2.vue'),
    name: 'Test',
    meta: { requiresAuth: true },
  },
  {
    path: '/test2',
    component: () => import('layouts/functionalTest.vue'),
    name: 'Test2',
    meta: { requiresAuth: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { requiresAuth: false },
  },
]

export default routes
