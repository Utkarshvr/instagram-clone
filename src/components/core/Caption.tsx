import { useState } from "react";
import {
  Text,
  Pressable,
  TextLayoutEventData,
  NativeSyntheticEvent,
} from "react-native";
import { Href, Link } from "expo-router";

export default function Caption({
  caption,
  profile,
  link,
}: {
  caption: string;
  link: Href;
  profile: {
    id: string;
    username: string;
  };
}) {
  const [textShown, setTextShown] = useState(false); // to toggle full text
  const [lengthMore, setLengthMore] = useState(false); // to show "more..." only if needed

  const showFullCaption = () => {
    setTextShown(true);
  };

  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (e.nativeEvent.lines.length > 2 && !textShown) {
      setLengthMore(true);
    }
  };

  return (
    <Text
      onTextLayout={onTextLayout}
      numberOfLines={textShown ? undefined : 2}
      ellipsizeMode="tail"
      className="text-neutral-200 font-mont text-sm"
      onPress={showFullCaption}
    >
      <Link href={link}>
        <Text className=" font-montSemiBold">{profile.username}</Text>
      </Link>{" "}
      {caption}
    </Text>
  );
}
