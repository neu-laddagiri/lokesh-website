export const RESUME_PDF = "/documents/lokesh-addagiri-resume.pdf" as const;

export const PROFILE_LINKS = {
  linkedin: "https://www.linkedin.com/in/lokeshaddagiri",
  github: "https://github.com/neu-laddagiri",
  resume: RESUME_PDF,
} as const;

export const resumeExternalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Add a photo at public/images/profile.jpg to show on the LinkedIn card */
export const PROFILE_IMAGE = "/images/profile.jpg";
