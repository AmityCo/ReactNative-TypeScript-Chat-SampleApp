import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Platform, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import navigation from '../navigation';
import { createChannel, queryUsers, createQuery, runQuery } from '@amityco/ts-sdk';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ChannelList } from './ChannelListScreen';


export default function ModalScreen() {
  const mountedRef = useRef(true)
  const [users, setUsers] = useState<Amity.User[]>([])
  const navigation = useNavigation();

  const currentPage: Amity.Page = { limit: 1000 }
  const query = createQuery(queryUsers, {
    page: currentPage,
    filter: 'all',
    sortBy: 'displayName'
  });
  useEffect(() => {
    runQuery(query, result => {

      if (result.data != undefined) {
        var arr: Amity.User[] = [];
        for (var val of result.data) {
          arr.push(val)
        }
        if (mountedRef.current) {
          setUsers(arr);
        }
        return () => {
          mountedRef.current = false
        };
      }
    });
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={users} renderItem={({ item }) => (
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => {
            const query = createQuery(createChannel, {
              displayName: item.displayName,
              userIds: [item.userId],
              avatarFileId: item.avatarFileId,
              type: "conversation",
            });

            runQuery(query, result => {
              if (result.error != undefined) {
                console.log("Error creating conversation " + JSON.stringify(result.error))
              }
              else {
                console.log("Successfully create conversation" + JSON.stringify(result))
                if (!result.loading) {

                  navigation.goBack();
                }
              }
            });
          }}>

            <View style={{ flexDirection: 'row' }}>
              <Image
                source={{ uri: item.avatarFileId ? `https://api.us.amity.co/api/v3/files/${item.avatarFileId}/download?size=small` : 'https://picsum.photos/200/300' }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{item.displayName}</Text>
            </View>

            <View
              style={{
                borderBottomColor: '#f2f2f2',
                borderBottomWidth: 1,
                paddingTop: 8
              }}
            />
          </TouchableOpacity>
        </View>
      )} keyExtractor={item => item.userId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
    paddingTop: 8
  },
  profileImage: {
    width: 36,
    height: 36,
    borderWidth: 0,
    borderColor: '#f2f2f2',
    borderRadius: 18,
    marginRight: 15,
    backgroundColor: '#cccccc',
  },
});
