import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen.js";
import ListarRotasScreen from "./screens/ListaRotas.js";
import ExibirCaminho from "./screens/ExibirCaminho.js";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function ListaStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Lista">
      <Stack.Screen name="Lista" component={ListarRotasScreen} />
      <Stack.Screen name="ExibirCaminho" component={ExibirCaminho} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#fff",
            height: 60,
            paddingTop: 10,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 15,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ListaStack"
          component={ListaStackNavigator}
          options={{
            tabBarLabel: "Lista",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="profile" size={20} color={color} />
            ),
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
