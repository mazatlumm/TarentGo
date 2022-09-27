import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';

const QRScannerTransaksi = ({navigation}) => {

    const [Url, setUrl] = useState('https://alicestech.com/tarent_outdoor/');
    const [IDUser, setIDUser] = useState('');
    const [Role, setRole] = useState('');

    const getDataUser = async () => {
        try {
            const value = await AsyncStorage.getItem('@AlluserData')
            if (value !== null) {
                setIDUser(JSON.parse(value)[0].id_user)
                setRole(JSON.parse(value)[0].role)

            } else {
                console.log('Tidak Ada Data');
            }
        } catch (e) {
            // error reading value
        }
    }

    useEffect(() => {
        getDataUser();
    }, [])
    
    const DetailTransaksi = (id_order, id_user) => {
        navigation.navigate('DetailPesanan', {id_order:id_order, id_user:id_user});
    }

    const ReadQR = async (c) => {
        console.log(c.data);
        //get data transaksi
        await axios.get(Url + 'api/transaksi/qr',{
            params: {
              qrdata: c.data,
            }
          })
        .then(response => {
            console.log(response.data.id_order);
            if(response.data.status == true){
                DetailTransaksi(response.data.id_order, IDUser)
            }else{
              
            }
        })
        .catch(e => {
          if (e.response.status == 404) {
            console.log(e.response.data)
  
          }
        });
    }

    return (
        <View style={{flex:1}}>
        <QRCodeScanner
            onRead={(c) => ReadQR(c)}
            // flashMode={RNCamera.Constants.FlashMode.torch}
            topContent={
            <Text style={styles.centerText}>
                Arahkan kamera ke kode QR bukti transaksi!
            </Text>
            }
            bottomContent={
            <View></View>
            }
        />
        </View>
    )
}

export default QRScannerTransaksi

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      }
})
