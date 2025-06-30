// App.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import AddBookScreen from "./(screens)/AddBookScreen";
import EditBookScreen from "./(screens)/EditBookScreen";
import HomeScreen from "./(screens)/HomeScreen";
import LoginScreen from "./(screens)/LoginScreen";
import RegisterScreen from "./(screens)/RegisterScreen"; // Tambahkan ini

const Stack = createNativeStackNavigator();

export default function App() {
  const [books, setBooks] = useState([]);

  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">{(props) => <LoginScreen {...props} setBooks={setBooks} />}</Stack.Screen>

      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen name="Home">{(props) => <HomeScreen {...props} books={books} setBooks={setBooks} />}</Stack.Screen>

      <Stack.Screen name="AddBook">{(props) => <AddBookScreen {...props} books={books} setBooks={setBooks} />}</Stack.Screen>

      <Stack.Screen name="EditBook">{(props) => <EditBookScreen {...props} books={books} setBooks={setBooks} />}</Stack.Screen>
    </Stack.Navigator>
  );
}
