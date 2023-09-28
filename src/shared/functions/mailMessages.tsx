var today: Date = new Date();
var currentHour: number = today.getHours();
var greeting: string = "";
const link: string = "https//:ecb.unicomms.app";
const username: string = "E-Performance System";

if (currentHour < 12) {
  greeting = "Good Morning";
} else if (currentHour < 18) {
  greeting = "Good Afternoon";
} else {
  greeting = "Good Evening";
}
// SCORECARD DRAFT MAIL NOTIFICATIONS
export const MAIL_SCORECARD_DRAFT_SUBMITTED_MANAGER = (
  name: string | null = ""
) => {
  const SUBJECT = `${name} - Scorecard Submission`;
  const BODY = [
    `${greeting},`,
    "",
    `${name} has submitted a draft scorecard for review.`,
    "",
    "Visit E-Performance System: https://ecb.unicomms.app for more.",
    "",
    "Sincerely,",
    // name,
    "E-Performance System",
  ];

  return {
    SUBJECT: SUBJECT,
    BODY: BODY.join("<br/>"),
  };
};

export const MAIL_SCORECARD_DRAFT_SUBMITTED_ME = (name: string | null = "") => {
  const MY_SUBJECT = `${name} - Scorecard Submission`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your draft scorecard has been successfully submitted to your manager for approval.`,
    "",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

// SCORECARD Q2 MAIL NOTIFICATIONS
export const MAIL_SCORECARD_Q2_SUBMITTED_MANAGER = (
  name: string | null = ""
) => {
  const SUBJECT = `Mid-Term Submission`;
  const BODY = [
    `${greeting},`,
    "",
    `${name} has submitted a draft mid-term progress update for review.`,
    "",
    "Visit E-Performance System: https://ecb.unicomms.app for more.",
    "",
    "Sincerely,",
    // name,
    "E-Performance System",
  ];

  return {
    SUBJECT: SUBJECT,
    BODY: BODY.join("<br/>"),
  };
};

export const MAIL_SCORECARD_Q2_SUBMITTED_ME = (name: string | null = "") => {
  const MY_SUBJECT = `${name} - Mid-Term Submission`;
  const MY_BODY = [
    `${greeting},`,
    "",
    "Your mid-term progress update has been successfully submitted to your manager for approval.",
    "",
    "Visit E-Performance System: https://ecb.unicomms.app for more.",
    "",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

// SCORECARD Q4 MAIL NOTIFICATIONS
export const MAIL_SCORECARD_Q4_SUBMITTED_MANAGER = (
  name: string | null = ""
) => {
  const SUBJECT = `Assessment Submission`;
  const BODY = [
    `${greeting},`,
    "",
    `${name}  has submitted their self assessment for your review.`,
    "",
    "Visit E-Performance System: https://ecb.unicomms.app for more.",
    "",
    "Sincerely,",
    // name,
    "E-Performance System",
  ];

  return {
    SUBJECT: SUBJECT,
    BODY: BODY.join("<br/>"),
  };
};
export const MAIL_SCORECARD_Q4_SUBMITTED_ME = (name: string | null = "") => {
  const MY_SUBJECT = `${name} - Appraisal Submission`;
  const MY_BODY = [
    `${greeting},`,
    "",
    "Your self assesment has been successfully submitted to your line manager for approval.",
    "",
    "Visit E-Performance System: https://ecb.unicomms.app for more.",
    "",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_WELCOME_ME = () => {
  const MY_SUBJECT = `Welcome to the E-Performance Management System`;
  const MY_BODY = [
    `Congrats, your e-performance management system account is now ready. 
    You see your objectives, give/get feedback, record your development plans 
    and see your alignment with company goals and vision.`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join(""),
  };
};

export const WELCOME_BODY = [
  `Congrats, your e-performance management system account is now ready. 
    You see your objectives, give/get feedback, record your development plans 
    and see your alignment with company goals and vision.`,
  "",
  `We encourage you to use the system on a regular basis which will help you 
    perform better and have better interaction with your manager.`,
  "",
  "Best Regards,",
  "HR Team",
];
export const WELCOME_SUBJECT = `Welcome to the E-Performance Management System`;
export const WELCOME_MESSAGE = WELCOME_BODY.join("<br/>");
export const MAIL_EMAIL = "e-performance@ecb.org.na";

// export const MAIL_SCORECARD_APPROVAL = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance contract has been approved.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];

//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MAIL_SCORECARD_REJECTION = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance contract has been rejected.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];
//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MAIL_MIDTERM_APPROVAL = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance midterm contract has been approved.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];

//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MAIL_MIDTERM_REJECTION = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance midterm contract has been rejected.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];

//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MAIL_ASSESSMENT_APPROVAL = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance assessment contract has been approved.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];

//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MAIL_ASSESSMENT_REJECTION = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance assessment contract has been rejected.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];

//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MAIL_MIDTERM_RATINGS = () => {
//   const SUBJECT = `Performance Contract`;
//   const BODY = [
//     `${greeting},`,
//     "",
//     `The peformance midterm contract has been rated.`,
//     "",
//     "Visit E-Performance System: https://ecb.unicomms.app for more.",
//     "",
//     "Regards,",
//     "E-Performance System",
//   ];

//   return {
//     SUBJECT: SUBJECT,
//     BODY: BODY.join("<br/>"),
//   };
// };

// export const MIDTERM_RATINGS_BODY = [
//   `The peformance midterm contract has been rated.`,
//   "",
//   "Visit E-Performance System: https://ecb.unicomms.app for more.",
//   "",
//   "Regards,",
//   "E-Performance System",
// ];

// export const MID_RATING_SUBJECT = `Peformance midterm contract rating`;
// export const MID_RATING_BODY = MIDTERM_RATINGS_BODY.join("<br/>");

// export const ASSESSMENT_RATINGS_BODY = [
//   `The peformance assessment contract has been rated.`,
//   "",
//   "Visit E-Performance System: https://ecb.unicomms.app for more.",
//   "",
//   "Regards,",
//   "E-Performance System",
// ];

// export const ASSESS_RATING_SUBJECT = `Peformance assessment contract rating`;
// export const ASSESS_RATING_BODY = ASSESSMENT_RATINGS_BODY.join("<br/>");

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MAIL_MIDTERM_RATINGS_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Midterm Contract ratings`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your midterm contract has been rated by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_ASSESSMENT_RATINGS_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Assessment Contract Ratings`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your Assessment contract has been rated by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];
  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_SCORECARD_APPROVED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Peformance Contract Approval`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your peformance contract has been approved by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};
export const MAIL_SCORECARD_REJECTED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Peformance Contract Rejection`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your peformance contract has been rejected by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_MIDTERM_APPROVED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Mid-Term Approval`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your midterm scorecard has been successfully approved by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};
export const MAIL_MIDTERM_REJECTED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Mid-Term Rejection`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your midterm scorecard has been rejected by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_ASSESSMENT_APPROVED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Assessment Approval`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your assessment scorecard has been successfully approved by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_ASSESSMENT_REJECTED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Assessment Rejection`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your assessment scorecard has been rejected by ${supervisorName}.`,
    "",
    "Regards,",
    "E-Performance System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_FEEDBACK = (sender: string | unknown, message: string) => {
  const SUBJECT = `Feedback`;
  const BODY = [
    `${greeting}`,
    "",
    `${message} ${sender}`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: SUBJECT,
    MY_BODY: BODY.join("<br/>"),
  };
};

export const MAIL_PROJECT_ADDED = (employeeName: string, project: string) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    `You were added to a project (${project}) by ${employeeName}`,

    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_PROJECT_REMOVED = (employeeName: string, project: string) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    `You were removed from a project (${project}) by ${employeeName}`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_TASK_ADDED = (
  userName: string | null,//adder
  projectName: string,
  taskName: string,
) => {
  const MY_SUBJECT = `${taskName}`;
  const MY_BODY = [
    `${greeting}`,

    `You were added to a task ${taskName} in project ${projectName}`,
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${userName}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_PROJECT_TASK_ADDED = (
  employeeName: string | null | undefined, //adder
  name: string | null | undefined, //project name or task
  type: "project" | "task",
  project?: string | null | undefined,
) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    (type === "project") ? `You were added to a project (${project}) by ${employeeName}` : "",
    (type === "task") ? `You were added to a task ${name} in project ${project}` : "",
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_MILESTONE_BILL = (
  message: string | null | undefined, //message
  name: string | null | undefined,
) => {  //message
  const MY_SUBJECT = `Mistone Billing`;
  const MY_BODY = [
    `${greeting}`,
    "",
    `${message}`,
    "",
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};
export const MAIL_PROJECT_TASK_REMOVED = (
  employeeName: string | null | undefined, //adder
  name: string | null | undefined, //project name or task
  type: "project" | "task",
  project?: string | null | undefined,
) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    (type === "project") ? `You were removed to a project (${name}) by ${employeeName}` : "",
    (type === "task") ? `You were removed to a task ${name} in project ${project}` : "",
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};