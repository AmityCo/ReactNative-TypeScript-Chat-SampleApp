import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, FlatList, StyleSheet, StatusBar, TouchableOpacity, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { queryChannels, createQuery, runQuery } from '@amityco/ts-sdk';
import moment from 'moment';
import { useIsFocused, useNavigation } from '@react-navigation/native';


export const ellipsis = (s: string, len: number) => {
  return s.length > len ? s.substring(0, len) + '..' : s;
};


export const ChannelList = () => {
    const currentPage:Amity.Page = {limit:50}
  const [channels, setChannels] = useState<Amity.Channel[]>([])
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const query = createQuery(queryChannels, {
    page: currentPage,
    membership: 'member',
    sortBy: 'lastCreated'
  });
  useEffect(() => {
    
    runQuery(query, result => {
      console.log("enter query channel list")

      if (result.data != undefined) {
        var arr: Amity.Channel[] = [];
        for (var val of result.data) {

          arr.push(val)
        }

        setChannels(arr);
      }

    });
  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={channels} renderItem={({ item }) => (
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.75}

            onPress={() =>
               navigation.navigate("ChatRoom", { channelId: item.channelId })
            

            }>

            <View style={styles.subContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: item.avatarFileId ? `https://api.us.amity.co/api/v3/files/${item.avatarFileId}/download?size=small` : 'https://picsum.photos/200/300' }}
                  style={styles.profileImage}
                />
                <View style={styles.contentContainer}>
                  <Text style={styles.name}>{ellipsis(item.displayName ?? '', 20)}</Text>

                </View>
              </View>
              <View style={styles.propertyContainer}>
                <Text style={styles.updatedAt}>{moment(item.updatedAt).fromNow()}</Text>

              </View>
            </View>
            <View
              style={{
                borderBottomColor: '#f2f2f2',
                borderBottomWidth: 1,
              }}
            />
          </TouchableOpacity>
        </View>
      )} keyExtractor={item => item.channelId} />
    </SafeAreaView>

  );
}

export default function ChannelListScreen({ navigation }: RootTabScreenProps<'ChannelList'>) {
  

  return ChannelList();
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,

    flex: 1
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderWidth: 0,
    borderColor: '#f2f2f2',
    borderRadius: 22,
    marginRight: 15,
    backgroundColor: '#cccccc',
  },

  contentContainer: {
    // flex: 1,
    position: 'relative',
    alignSelf: 'center',
    // paddingBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  propertyContainer: {
    justifyContent: 'center'
  },
  unreadMessageCountContainer: {
    minWidth: 20,
    padding: 3,
    borderRadius: 10,
    backgroundColor: '#742ddd',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  unreadMessageCount: {
    fontSize: 12,
    color: '#fff',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    marginBottom: 4,
  },
})