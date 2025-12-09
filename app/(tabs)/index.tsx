import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-6xl font-bold italic text-blue-500 text-justify">
        HELLOOOOO WORLD
      </Text>
      <Text>This is a normal text.</Text>
      <Link href="/" className="text-blue-500 text-xl p-5 bg-red-100">
        Go to Onboarding
      </Link>
      <Link
        href="/movie/avenger-porn"
        className="text-blue-500 text-xl p-5 bg-red-100"
      >
        Go to Movie Details
      </Link>
    </View>
  );
}
