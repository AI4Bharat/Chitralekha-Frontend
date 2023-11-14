const endpoints = {
  //User
  signup: "/users/invite/",
  users: "/users/auth/jwt/create/",
  userList: "/users/auth/users/",
  loggedInUserDetails: "/users/account/me/fetch/",
  getUserDetails: "/users/account/",
  addOrganizationMember: "/users/invite/generate/",
  updateEmail: "/users/account/update_email/",
  verifyUpdateEmail: "/users/account/verify_email_updation/",
  updateProfile: "/users/account/update/",
  changePassword: "/users/auth/users/set_password/",
  resetPassword: "/users/auth/users/reset_password/",
  confirmResetPassword: "/users/auth/users/reset_password_confirm/",
  languages: "/users/languages/fetch/",
  userRoles: "/users/roles/",
  newsletterSubscribe: "/newsletter/subscribe/",
  newsletter: "/newsletter/",

  //Video
  video: "/video/",
  transcript: "/transcript/",
  translation: "/translation/",
  voiceover: "/voiceover/",
  videoSubtitle: "/transcript/get_word_aligned_json/?video_id",

  //organization
  organization: "/organization/",

  //Project
  project: "/project/",
  youtube: "/youtube/",

  //Task
  task: "/task/",
};

export default endpoints;