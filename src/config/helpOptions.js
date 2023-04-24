export const addNewVideo = [
  "Login with the account which has a Project Manager role.",
  "Open any project using the view button, under which the new video needs to be created.",
  <span>
    Go to the <b>'Videos'</b> sub tab.
  </span>,
  <span>
    Click on <b>'Create a new Video/Audio'</b>
  </span>,
  `Select the source language of the video.`,
  `Paste the youtube video url.`,
];

export const editingReviewTasks = [
  `Login with the account associated with the particular role. (Editor role for editing tasks and Reviewer role for the task reviews)`,
  <span>
    Go to the <b>'Tasks'</b> tab.
  </span>,
  <span>
    On the task that you want to edit/review, click on the <b>'Edit'</b> icon.
  </span>,
  `If there are any dependent tasks, it would be greyed out.`,
  `The editor window show now open up based on the task type.`,
];

export const assignTasks = [
  `Login with the account which has a Project Manager role.`,
  `Open any project using the view button, under which the new video needs to be created.`,
  <span>
    Go to the <b>'Tasks'</b> sub tab.
  </span>,
  <span>
    Click on the <b>'Edit Task Details'</b> icon.
  </span>,
  <span>
    On the modal, click on the dropdown for <b>'Assign User'</b>.
  </span>,
  `Replace the assigned user with the new user.`,
  <span>
    Click on <b>'Update Task'</b>
  </span>,
];

export const editTranscription = [
  `Login with the account associated with the Transcriptor editor/reviewer role, based on the task type.`,
  <span>
    Go to the <b>'Tasks'</b> tab
  </span>,
  <span>
    On the task that you want to edit/review, click on the <b>'Edit'</b> icon.
  </span>,
  `If there are any dependent tasks, it would be greyed out.`,
  `The editor window show now open up based on the task type.`,
  `Continue with editing. The UI is very intuitive.`,
  `Play the video to see the auto transcriptions generated.`,
  `If any changes are required, click on that specific card & start editing.`,
  `Transliteration based typing feature would be made available for non-English languages.`,
  `The timeline can also be adjusted wherever required.`,
  `The Merge, Split, Delete, Add buttons also aid in achieving high quality transcripts.`,
  <span>
    Once done, click on <b>'Complete'</b> icon.
  </span>,
];

export const editTranslation = [
  `Login with the account associated with the Translation editor/reviewer role, based on the task type.`,
  <span>
    Go to the <b>'Tasks'</b> tab.
  </span>,
  <span>
    On the task that you want to edit/review, click on the <b>'Edit'</b> icon.
  </span>,
  `If there are any dependent tasks, it would be greyed out.`,
  `The editor window show now open up based on the task type.`,
  `Continue with editing. The UI is very intuitive.`,
  `Play the video to see the translations syncing up.`,
  `If any changes are required, click on that specific card & start editing.`,
  `Transliteration based typing feature would be made available for non-English languages.`,
  `The word count is shown for reference for both the source & target sentences. If voice over task is pipelined, make sure the word count difference is minimal.`,
  `Temporarily the source side sentences can also be edited, but this doesn't affect the global Transcript.`,
  <span>
    Once done, click on <b>'Complete'</b> icon.
  </span>,
];

export const Workflow = [
  `A workflow is a set of tasks pipelined to achieve the final output.`,
  <span>
    At a bare minimum, there should be atleast a <b>'Translation Edit'</b> task
    as part of a workflow.
  </span>,
  `Default workflows can be set both at Org level and Project level.`,
  `This of course can be modified later.`,
  `To set Default workflows, follow the steps:`,
];

export const workflowInnerList = [
  {
    label: "At Org Level:",
    list: [
      "Login with the account which has a Org Owner role.",
      <span>
        Click on the <b>'Settings'</b> tab
      </span>,
      <span>
        On the <b>'Default workflow'</b> section, make the required changes.
      </span>,
      <span>
        Once finalized, click on <b>'Update Organization'</b>
      </span>,
    ],
  },
  {
    label: "At Project Level:",
    list: [
      "Login with the account which has a Project Manager role.",
      `Select a specific project for which we need to update the Default Workflow.`,
      <span>
        Click on the <b> 'Settings' </b> icon next to the project name.
      </span>,
      <span>
        On the <b>'Default workflow'</b> section, make the required changes.
      </span>,
      <span>
        Once finalized, click on <b>'Update Project'</b>.
      </span>,
    ],
  },
];
