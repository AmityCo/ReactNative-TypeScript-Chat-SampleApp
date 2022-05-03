import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {
  createClient,
  disableCache,
  API_REGIONS,
  enableCache
} from "@amityco/ts-sdk";
import { connectClient } from '@amityco/ts-sdk';
const data = require('./env.json')
const apiKey:string = data["API_KEY"]
const userID:string = data['USER_ID']?data['USER_ID']:"TestUser"
console.log(apiKey)
export const client = createClient(apiKey, API_REGIONS.SG)


const handleConnect = async () => {

  await connectClient({userId:userID,displayName:userID});
};
disableCache()
handleConnect();


export default function App() {


  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {

    return null;
  } else {

    return (
      <SafeAreaProvider style={{}}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
