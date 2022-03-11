/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, ColorSchemeName, Pressable, TouchableHighlight, View } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/CreateChatScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import ChannelListScreen from '../screens/ChannelListScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import { RootStackParamList } from '../types';
import { ChannelList, queryChannelList } from '../screens/ChannelListScreen';
import { useRef } from 'react';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const navigation = useNavigation();
  const mountedRef = useRef(true)
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} /> */}
      <Stack.Screen name="ChannelList" component={ChannelListScreen} options={{
        headerShown: true,
        title: "Chat",
        headerRight: () => (
          <TouchableHighlight
            underlayColor={'#82bc0000'}
            onPress={() => {

              navigation.navigate("Modal")
            }}>
            <View>
              <AntDesign
                name="plus"
                size={25}
                style={{ marginRight: 15 }}
              />
            </View>
          </TouchableHighlight>
        ),
      }} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} initialParams={{ channelId: '' }} options={{
        headerShown: true,
        headerLeft: () => (
          <TouchableHighlight
            underlayColor={'#82bc0000'}
            onPress={() => {
              navigation.goBack();

            }}>
            <View>
              <Ionicons
                name="chevron-back"
                size={25}
              />
            </View>
          </TouchableHighlight>
        ),
      }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} options={{
          title: 'Choose user',
          headerShown: true,
          headerLeft: () => (
            <TouchableHighlight
              underlayColor={'#82bc0000'}
              onPress={() => {
                mountedRef.current = false;
                navigation.goBack();

              }}>
              <View>
                <Ionicons
                  name="close"
                  size={25}
                />
              </View>
            </TouchableHighlight>
          ),
        }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
// const BottomTab = createBottomTabNavigator<RootTabParamList>();

// function BottomTabNavigator() {
//   const colorScheme = useColorScheme();

//   return (
//     <BottomTab.Navigator
//       initialRouteName="ChannelList"
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme].tint,
//       }}>
//       <BottomTab.Screen
//         name="ChannelList"
//         component={ChannelListScreen}
//         options={({ navigation }: RootTabScreenProps<'ChannelList'>) => ({
//           title: 'Tab One',
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//           headerRight: () => (
//             <Pressable
//               onPress={() => navigation.navigate('Modal')}
//               style={({ pressed }) => ({
//                 opacity: pressed ? 0.5 : 1,
//               })}>
//               <FontAwesome
//                 name="info-circle"
//                 size={25}
//                 color={Colors[colorScheme].text}
//                 style={{ marginRight: 15 }}
//               />
//             </Pressable>
//           ),
//         })}
//       />
//       <BottomTab.Screen
//         name="ChatRoom"
//         component={ChatRoomScreen}
//         options={{
//           title: 'Tab Two',
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       />
//     </BottomTab.Navigator>
//   );
// }

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
// }
