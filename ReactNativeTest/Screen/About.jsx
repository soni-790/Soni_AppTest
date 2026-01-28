import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";

const About = () => {


  const [user,setUser] = useState(null)

  const checkLogin = async () => {
    const data = await AsyncStorage.getItem("user");

    if(data){
      setUser(JSON.parse(data))
    }
  }

  useEffect(() => {
    checkLogin()

  },[])

  const login = async () => {
    const userData = {
      name:"Priyanshu",
      email:"priyanshu@gmail.com"
    }

    await AsyncStorage.setItem("user",JSON.stringify(userData))

    setUser(userData)
  }

  const Logout = async () => {
    await AsyncStorage.removeItem("user")

    setUser(null)
  }

  return (
  <SafeAreaView style={styles.container}>

    {user ? (
        <View>
          <Text>Welcome</Text>
          <Text>Name : {user.name}</Text>
          <Text>Email : {user.email}</Text>


          <Button title='Logout' onPress={Logout}/>
        </View>
      ) : (
        <Button title="Login" onPress={login} />
      )
    }


  </SafeAreaView>
  )
}

export default About

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  
})