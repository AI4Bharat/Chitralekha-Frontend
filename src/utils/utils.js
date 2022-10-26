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
