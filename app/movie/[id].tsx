import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { fetchTMDB } from "@/services/api";
import useFetch from "@/services/useFetch";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id, type = "movie" } = useLocalSearchParams<{
    id: string;
    type?: "movie" | "tv";
  }>();

  // Type'a göre doğru endpoint'i seç
  const endpoint = type === "tv" ? `tv/${id}` : `movie/${id}`;
  const videosEndpoint =
    type === "tv" ? `tv/${id}/videos` : `movie/${id}/videos`;

  const { data: details, loading } = useFetch(
    () => fetchTMDB<MovieDetails>(endpoint, { responseKey: undefined }),
    true,
  );

  const { data: videosData } = useFetch(
    () =>
      fetchTMDB<Array<{ key: string; site: string; type: string }>>(
        videosEndpoint,
        { responseKey: "results" },
      ),
    true,
  );

  // Trailer'ı bul (YouTube'dan ve Trailer type'ından)
  const videos =
    (videosData as Array<{ key: string; site: string; type: string }>) || [];
  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  // Movie ve TV show için ortak alanlar
  const title = details?.title || details?.name || "N/A";
  const releaseDate = details?.release_date || details?.first_air_date;
  const runtime = details?.runtime || details?.episode_run_time?.[0] || null;
  const isTVShow = type === "tv";

  // Trailer'a yönlendir
  const handlePlayPress = async () => {
    if (trailerUrl) {
      const canOpen = await Linking.canOpenURL(trailerUrl);
      if (canOpen) {
        await Linking.openURL(trailerUrl);
      }
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${details?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
            className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
            onPress={handlePlayPress}
            disabled={!trailerUrl}
          >
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            {releaseDate && (
              <Text className="text-light-200 text-sm">
                {releaseDate.split("-")[0]} •
              </Text>
            )}
            {runtime && (
              <Text className="text-light-200 text-sm">
                {runtime}m{isTVShow ? " per episode" : ""}
              </Text>
            )}
            {isTVShow && details?.number_of_seasons && (
              <Text className="text-light-200 text-sm">
                • {details.number_of_seasons} season
                {details.number_of_seasons > 1 ? "s" : ""}
              </Text>
            )}
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(details?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({details?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={details?.overview} />
          <MovieInfo
            label="Genres"
            value={details?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          {!isTVShow && (
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo
                label="Budget"
                value={`$${((details?.budget ?? 0) / 1_000_000).toFixed(
                  1,
                )} million`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(
                  (details?.revenue ?? 0) / 1_000_000,
                )} million`}
              />
            </View>
          )}

          {isTVShow && details?.number_of_episodes && (
            <MovieInfo
              label="Total Episodes"
              value={details.number_of_episodes.toString()}
            />
          )}

          <MovieInfo
            label="Production Companies"
            value={
              details?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
