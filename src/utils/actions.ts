import { Linking } from "react-native";

export const openGmail = async () => {
  const gmailURL = "https://gmail.app.goo.gl";
  const fallbackURL = "https://mail.google.com";

  const supported = await Linking.canOpenURL(gmailURL);
  if (supported) {
    Linking.openURL(gmailURL);
  } else {
    Linking.openURL(fallbackURL); // fallback opens default mail app
  }
};
