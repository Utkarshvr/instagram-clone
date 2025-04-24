import { useEffect } from "react";
import { Linking } from "react-native";
import { useDeepLink } from "@/store/useDeepLink";

export default function DeepLinking() {
  const setUrl = useDeepLink((state) => state.setUrl);

  useEffect(() => {
    const listener = ({ url }: { url: string }) => {
      if (url) {
        setUrl(url);
      }
    };

    Linking.addEventListener("url", listener);
    Linking.getInitialURL().then((url) => {
      if (url) {
        setUrl(url);
      }
    });

    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);

  return null;
}
