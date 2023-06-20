export const genderOptions = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  },
];

export const ageGroupOptions = [
  {
    label: "1-10",
    value: "1-10",
  },
  {
    label: "11-20",
    value: "11-20",
  },
  {
    label: "21-60",
    value: "21-60",
  },
  {
    label: "61-100",
    value: "61-100",
  },
];

export const speakerFields = [
  {
    label: "Enter Speaker Name",
    name: "name",
    type: "text",
    sx: {
      margin: "4px 4px 4px 0",
      width: "49.5%",
      backgroundColor: "#fff",
    },
  },
  {
    label: "Enter Speaker ID",
    name: "id",
    value: "",
    type: "text",
    sx: {
      margin: "4px 0 4px 4px",
      width: "49.5%",
      backgroundColor: "#fff",
    },
  },
  {
    label: "Select Speaker Gender",
    name: "gender",
    type: "select",
    sx: {
      margin: "4px 4px 4px 0",
      width: "49.5%",
      backgroundColor: "#fff",
    },
    options: genderOptions,
  },
  {
    label: "Select Age group",
    name: "age",
    type: "select",
    sx: {
      margin: "4px 0 4px 4px",
      width: "49.5%",
      backgroundColor: "#fff",
    },
    options: ageGroupOptions,
  },
];

export const voiceOptions = [
  {
    label: "Male - Adult",
    value: "Male",
  },
  {
    label: "Female - Adult",
    value: "Female",
  },
];
