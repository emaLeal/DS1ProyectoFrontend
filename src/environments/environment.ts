export const environment = {
  production: false,
  baseUrl: 'http://localhost:8000/api',
  authentication: {
    login: '/auth/login/',
    register: '/auth/register/',
    profile: '/auth/get_profile/',
    resetPassword: '/auth/password_reset/',
    confirmResetPassword: '/auth/password_reset/confirm/?token=',
    changePassword: '/auth/change_password/'
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
    getPostulants: '/applicant/getall/',
    getOnePostulant: '/applicant/get/',
    createPostulants: '/applicant/create/',
    updatePostulant: '/applicant/update/',
    deletePostulants: '/applicant/delete/',
  },
  postulations: {
    postulate: '/postulation/create/',
    getAll: '/applicant/getall/'
  },
  users: {
    getUsers: '/auth/users/getall/'
  } // Ajusta esta URL según tu backend
}; 