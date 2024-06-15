import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (data) => {
  const msg = { ...data, from: "alexh@noca.ai" };
  await sgMail.send(msg);
  return true;
};

export default { sendMail };
