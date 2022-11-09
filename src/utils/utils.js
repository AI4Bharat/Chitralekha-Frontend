export function authenticateUser() {
  const access_token = localStorage.getItem("token");
  if (access_token) {
    return true;
  } else {
    return false;
  }
}

export const steps = [
  {
    content: "Welcome to Chitralekha. Let's begin our journey!",
    title: "Welcome",
    placement: "center",
    target: "body",
  },
  {
    target: ".organizations",
    title: "Organizations",
    content: "Access All the info about your organizations here",
    placement: "bottom",
  },
  {
    target: ".projects",
    title: "Projects",
    content: "Access All the info about your projects here",
    placement: "bottom",
  },
  {
    target: ".workspace",
    title: "Workspace",
    content: "Access All the info about your workspace here",
    placement: "bottom",
  },
  {
    target: ".help",
    title: "Help",
    content: "Access Help",
    placement: "bottom",
  },
  {
    target: ".settings",
    title: "Settings",
    content: "Access Settings",
    placement: "bottom",
  },
  {
    target: ".profile",
    title: "User Profile",
    content: "Edit or view your profile information.",
    placement: "bottom",
  },
  {
    target: ".main",
    content: "Content Here",
    placement: "top",
  },
];

export const roles = [
  {
    id: 1,
    type: "Transcript editor"
  },
  {
    id: 2,
    type: "Transcript Reviewer"
  },
  {
    id: 3,
    type: "Translation editor"
  },
  {
    id: 4,
    type: "Translation Reviewer"
  },
  {
    id: 5,
    type: "Universal Editor"
  },
  {
    id: 6,
    type: "Project Manager"
  },
  {
    id: 7,
    type: "Organization Owner"
  },
];