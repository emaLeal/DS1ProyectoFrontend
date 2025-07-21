export const environment = {
  production: false,
  baseUrl: 'http://localhost:8000/api',
  authentication: {
    login: '/auth/login/',
    register: '/auth/register/',
    profile: '/auth/get_profile/',
    resetPassword: '/auth/password_reset/',
    confirmResetPassword: '/auth/password_reset/confirm/?token='
  },
  offers: {
    getOffers: '/offer/getall/',
    getOneOffer: 'offer/get/',
    createOffer: '/offer/post/',
    updateOffer: '/offer/put/',
    deleteOffer: '/offer/delete/'
  },
  role: {
    getRoles: '/roles/getall/',
    createRole: '/roles/create/',
    updateRole: '/roles/update/',
    deleteRole: '/roles/delete/'
  },
  postulants: {
    getPostulants: '/postulant/getall/',
    getOnePostulant: 'postulant/get/',
    createPostulants: '/postulant/create/',
    updatePostulant: 'postulant/update/',
    deletePostulants: '/postulant/delete/',
  },
  postulations: {
    postulate: '/postulation/create/'
  },
  users: {
    getUsers: '/auth/users/getall/'
  } // Ajusta esta URL según tu backend
}; 