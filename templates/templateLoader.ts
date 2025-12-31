import fs from "fs";
import path from "path";

function loadTemplate(filename: string): string {
  // Load from project root for Vercel compatibility
  const templatePath = path.join(process.cwd(), "templates", filename);
  return fs.readFileSync(templatePath, "utf8");
}

function replaceVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  });
  return result;
}

export const emailTemplates = {
  verification: (name: string, verificationUrl: string): string => {
    const template = loadTemplate("verifyaccount.html");
    return replaceVariables(template, {
      name,
      verificationUrl,
    });
  },

  passwordReset: (name: string, resetUrl: string): string => {
    const template = loadTemplate("resetaccountpassword.html");
    return replaceVariables(template, {
      name,
      resetUrl,
    });
  },

  welcome: (name: string, dashboardUrl: string, helpUrl: string): string => {
    const template = loadTemplate("welcomeaccount.html");
    return replaceVariables(template, {
      name,
      dashboardUrl,
      helpUrl,
    });
  },

  contactSupport: (
    name: string,
    message: string,
    referenceId: string,
    dashboardUrl: string = "https://evalocal.com/dashboard",
    helpUrl: string = "https://evalocal.com/help",
    termsUrl: string = "https://evalocal.com/terms",
    privacyUrl: string = "https://evalocal.com/privacy"
  ): string => {
    const template = loadTemplate("contactsupport.html");
    return replaceVariables(template, {
      name,
      message,
      referenceId,
      dashboardUrl,
      helpUrl,
      termsUrl,
      privacyUrl,
      currentYear: new Date().getFullYear().toString(),
    });
  },
};
