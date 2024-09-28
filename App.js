import React, { useEffect, useState } from "react";
import { FlatList, PermissionsAndroid, Text, View } from 'react-native'
import SmsAndroid from 'react-native-get-sms-android'


const App = () => {

  const [smsList, setSmsList] = useState([])

  // ---------------------------------------------------------------------------

  async function requstSmsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Permission",
          message: 'This App needs access to your SMS massage',
          buttonNeutral: "Ask me Later",
          buttonNegative: "Cancel",
          buttonPositive: "Ok"
        }
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED

    } catch (error) {
      console.warn(error)
      return false
    }

  }

  // -----------------------------------------------------------------------------------------

  useEffect(() => {
    async function fetchSms() {
      const hasPermission = await requstSmsPermission()
      if (hasPermission) {
        SmsAndroid.list(
          JSON.stringify({
            box: 'inbox',
            maxCount: 100
          }),
          (fail) => {
            console.log('Failed with this error' + fail)
          },
          (count, smsList) => {
            const messages = JSON.parse(smsList)
          

            // ---------------bank msg filter------
            const bankMessages = messages.filter((msg) => {

              return msg.address.includes('BANK') ||  /transaction|POS|ATM|VISA|credit|debit|otp|Raast Payment|BIPL|A\/C No|IBFT/i.test(msg.body);
            });
            console.log('Bank Messages:', bankMessages);
            setSmsList(bankMessages)



          }
        )
      }

    }
    fetchSms();
  }, [])

  // --------------------------------------------------------------------------------
  const renderItems = ({ item }) => {
    
    return (
      <View style={{ margin: 10, padding: 10, backgroundColor: '#f9f9f9' }}>
        <Text style={{ color: 'black' }}>{item.address}</Text>
        <Text style={{ color: 'black' }}>{item.body}</Text>
        <Text style={{ color: 'black' }}>{new Date(item.date).toLocaleString()}</Text>

      </View>
    )

  }

// -----------------------------------------------------------------------------------

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <FlatList
        data={smsList}
        keyExtractor={(item, index) => item._id.toString()}
        renderItem={renderItems}
        ListEmptyComponent={<Text style={{ color: 'black' }}>SMS not found</Text>}
      />
    </View>
  )
}
export default App;