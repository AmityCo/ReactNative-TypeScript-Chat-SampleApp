import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { queryMessages, createQuery, runQuery, createMessage, observeMessages } from '@amityco/ts-sdk';
import { RootTabScreenProps } from '../types';

import { client } from '../App';



export interface IMessage {
  _id: string | number
  text: string
  createdAt: Date | number
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
}

export default function ChatRoomScreen({ route, }: RootTabScreenProps<'ChatRoom'>) {


  var messageArray:{}[] = []
  const [messages, setMessages] = useState<{}>([]);

  const currentPage: Amity.Page = { limit: 50 }

  const query = createQuery(queryMessages, {
    page: currentPage,
    channelId: route.params.channelId
  });

  useEffect(() => {



    runQuery(query, result => {

      if (result.data != undefined) {

        messageArray = []
        for (let data of result.data) {

          let textMessage:string = data?.data['text']
          let message = {
            _id: data?.messageId,
            text: textMessage,
            createdAt: new Date(),
            user: {
              _id: data?.userId,
              name: data?.userId,
              avatar: 'https://placeimg.com/140/140/any',
            },
          }
          messageArray.push(message)
        }
      }
      messageArray.reverse()

      setMessages(messageArray)
    });


  }, [])



  useEffect(
    () => observeMessages(route.params.channelId, (result) => {

      runQuery(query, result => {

        if (result.data != undefined) {

          messageArray = []
          for (let data of result.data) {
         
            messageArray.push({
              _id: data?.messageId,
              text: data.data['text'],
              createdAt: new Date(),
              user: {
                _id: data?.userId,
                name: data?.userId,
                avatar: 'https://placeimg.com/140/140/any',
              },
            })
          }
        }
        messageArray.reverse()

        setMessages(messageArray)
      });


    }),
    [route.params.channelId]
  )
  // useEffect(
  //   () => observeMessage(messageId, setMessageResult),
  //   [messageId],
  // );

  const onSend = useCallback((message) => {
    console.log(message)
    const query = createQuery(createMessage, {
      channelId: route.params.channelId,

      data: {
        text: message[0].text
      },
      metadata: {
        data: "anything"
      }
    });

    runQuery(query, result => {


    });
    setMessages(previousMessages => GiftedChat.append(previousMessages, message))



  }, [])

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <GiftedChat
        renderUsernameOnMessage={true}

        showUserAvatar={false}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: client.userId ?? "",
        }}
      />
    </View>
  )
}

