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

/**
 * For next/link. The resume is a static file, not a route, so prefetching it
 * as one fails: Vercel answers that RSC request with a 404 on every subpage.
 */
export const resumeLinkProps = { ...resumeExternalProps, prefetch: false } as const;

/** Add a photo at public/images/profile.jpg to show on the LinkedIn card */
export const PROFILE_IMAGE = "/images/profile.jpg";
