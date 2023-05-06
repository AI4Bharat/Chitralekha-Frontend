import { availability, roles } from "../utils/utils";

export const profileOptions = [
  {
    title: "First Name",
    name: "first_name",
    type: "textField",
  },
  {
    title: "Last Name",
    name: "last_name",
    type: "textField",
  },
  {
    title: "Email",
    name: "email",
    type: "textField",
  },
  {
    title: "Phone Number",
    name: "phone",
    type: "textField",
  },
  {
    title: "User Name",
    name: "username",
    type: "textField",
  },
  {
    title: "Role",
    name: "role",
    type: "select",
    iterator: roles,
  },
  {
    title: "Availability Status",
    name: "availability",
    type: "select",
    iterator: availability,
  },
];
