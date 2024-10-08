const endpoints = {
  //User
  signup: "/users/invite/",
  users: "/users/auth/jwt/create/",
  userList: "/users/auth/users/",
  loggedInUserDetails: "/users/account/me/fetch/",
  getUserDetails: "/users/account/",
  addOrganizationMember: "/users/invite/generate/",
  updateEmail: "/users/account/update_email/",
  updateNewsLetterEmail: "/newsletter/update_email/",
  verifyUpdateEmail: "/users/account/verify_email_updation/",
  updateProfile: "/users/account/update/",
  changePassword: "/users/auth/users/set_password/",
  resetPassword: "/users/auth/users/reset_password/",
  confirmResetPassword: "/users/auth/users/reset_password_confirm/",
  languages: "/users/languages/fetch/",
  userRoles: "/users/roles/",
  updateSubscription: "/newsletter/update_subscription/",
  unSubscribeFromEmail: "/newsletter/unsubscribe",
  newsletter: "/newsletter/",
  preview: "/newsletter/preview/",
  onboarding: "/onboarding/",

  //Video
  video: "/video/",
  getVideoTasks: '/video/list_tasks',
  listVideosTasks:'/video/get_listings',
  transcript: "/transcript/",
  GetAllTranscriptions:"/transcript/retrieve_all_transcriptions/",
  GetAllTranslations:"/translation/retrieve_all_translations/",
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

  //Transliteration
  transliteration: "/api/generic/transliteration/",

  //Glossary
  glossary: "/glossary/",
};

export default endpoints;