import { Linking, Text, TouchableOpacity, View } from "react-native";

interface ApiErrorProps {
  message?: string;
}

export default function ApiError({ message }: ApiErrorProps) {
  const isApiMissing = message?.includes("API configuration is missing");

  const handleGitHubPress = () => {
    Linking.openURL("https://github.com/kahramanX");
  };

  const handleRepoPress = () => {
    Linking.openURL("https://github.com/kahramanX/expo-movie-app");
  };

  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <View className="bg-dark-100 rounded-2xl p-6 w-full max-w-md">
        {/* Error Icon */}
        <View className="items-center mb-4">
          <View className="w-16 h-16 rounded-full bg-red-500/20 items-center justify-center">
            <Text className="text-4xl">⚠️</Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-white text-xl font-bold text-center mb-3">
          Configuration Error
        </Text>

        {/* Message */}
        <Text className="text-gray-300 text-center mb-4 leading-6">
          {message || "An unexpected error occurred while fetching data."}
        </Text>

        {isApiMissing && (
          <>
            {/* Instructions */}
            <View className="bg-dark-200 rounded-xl p-4 mb-4">
              <Text className="text-white font-semibold mb-2">
                How to fix this:
              </Text>
              <Text className="text-gray-400 text-sm leading-5">
                1. Create a <Text className="text-accent">.env</Text> file in
                the project root{"\n"}
                2. Copy contents from{" "}
                <Text className="text-accent">.env.example</Text>
                {"\n"}
                3. Add your TMDB API key{"\n"}
                4. Restart the app
              </Text>
            </View>

            {/* Get API Key Info */}
            <View className="bg-dark-200 rounded-xl p-4 mb-4">
              <Text className="text-white font-semibold mb-2">
                Get your API key:
              </Text>
              <Text className="text-gray-400 text-sm leading-5">
                Visit{" "}
                <Text className="text-accent">themoviedb.org/settings/api</Text>{" "}
                to create a free account and get your API key.
              </Text>
            </View>
          </>
        )}

        {/* Contact Section */}
        <View className="border-t border-gray-700 pt-4 mt-2">
          <Text className="text-gray-400 text-center text-sm mb-3">
            Need help? Contact the developer:
          </Text>

          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              onPress={handleGitHubPress}
              className="bg-gray-800 rounded-xl px-4 py-3 flex-row items-center"
            >
              <Text className="text-white font-medium">@kahramanX</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRepoPress}
              className="bg-accent rounded-xl px-4 py-3 flex-row items-center"
            >
              <Text className="text-white font-medium">View Repo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
