import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const MovieDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>MovieDetail : {id} TEXT HELLOOOO</Text>
    </View>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({});
