import React, {useEffect, useState} from 'react'
import {View, Text, ActivityIndicator} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from "react-native-bootsplash";
import Dashboard from './assets/screen/Dashboard';
import Login from './assets/screen/Login';
import Kategori from './assets/screen/Kategori';
import Produk from './assets/screen/Produk';
import PilihKategori from './assets/screen/PilihKategori';
import Profile from './assets/screen/Profile';
import Checkout from './assets/screen/Checkout';
import DetailPesanan from './assets/screen/DetailPesanan';
import DaftarTransaksi from './assets/screen/DaftarTransaksi';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer onReady={() => RNBootSplash.hide()}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="Kategori"
                    component={Kategori}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="Produk"
                    component={Produk}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="PilihKategori"
                    component={PilihKategori}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="Checkout"
                    component={Checkout}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="DetailPesanan"
                    component={DetailPesanan}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="DaftarTransaksi"
                    component={DaftarTransaksi}
                    options={{
                        header: () => null
                    }}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        header: () => null
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App
