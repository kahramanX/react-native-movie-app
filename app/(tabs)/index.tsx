import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchTMDB } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(
    () =>
      fetchTMDB<Movie[]>("discover/movie", {
        queryParams: {
          sort_by: "popularity.desc",
        },
        responseKey: "results",
      }),
    true,
  );

  const {
    data: tvShowsData,
    loading: tvShowsLoading,
    error: tvShowsError,
  } = useFetch(
    () =>
      fetchTMDB<Movie[]>("discover/tv", {
        queryParams: {
          sort_by: "popularity.desc",
        },
        responseKey: "results",
      }),
    true,
  );

  const { data: trendingMoviesData } = useFetch(
    () => fetchTMDB<Movie[]>("trending/movie/week", { responseKey: "results" }),
    true,
  );

  const { data: trendingSeriesData } = useFetch(
    () => fetchTMDB<Movie[]>("trending/tv/week", { responseKey: "results" }),
    true,
  );

  return (
    <View className="flex-1 bg-primary h-full">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView
        className="flex-1 px-5 h-full"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <View>
          {moviesLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : moviesError ? (
            <Text className="text-white text-xl mt-10">
              Error : {JSON.stringify(moviesError, null, 2)}
            </Text>
          ) : (
            <>
              <SearchBar
                placeholder="Search.."
                onPress={() => router.push("/search")}
              />

              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Weekly Trending Movies
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                data={trendingMoviesData as Movie[]}
                contentContainerStyle={{
                  gap: 26,
                }}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />

              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Weekly Trending TV Shows
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                data={trendingSeriesData as Movie[]}
                contentContainerStyle={{
                  gap: 26,
                }}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />

              <Text className="text-lg text-white font-bold mt-5">
                Latest Movies
              </Text>

              <FlatList
                data={moviesData as Movie[]}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />

              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest TV Shows
              </Text>

              <FlatList
                data={tvShowsData as Movie[]}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
