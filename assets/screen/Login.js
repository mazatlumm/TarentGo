import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Image
} from 'react-native'
import {Icon} from 'react-native-elements'
import styles from '../style/StyleLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogoApp from '../app/logo.jpg'

const Login = ({navigation, route}) => {

    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [isLoading, setLoading] = useState(false);
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [VisiblePassword1, setVisiblePassword1] = useState(true);
    const [IconEye1, setIconEye1] = useState('eye-slash');

    React.useEffect(() => {
        getDataUser();
    }, [])

    const getDataUser = async () => {
        try {
            const value = await AsyncStorage.getItem('@userData')
            if (value !== null) {
                var shared_key = value;
                if (shared_key != null && shared_key != '') {
                    console.log('already login');
                    console.log('Shared Key: ' + shared_key);
                    navigation.navigate('Dashboard');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard' }],
                    });
                } else {
                    console.log('not yet login');
                }
            } else {
                console.log('Tidak Ada Data');
            }
        } catch (e) {
            // error reading value
        }
    }

    const MasukAkun = () => {
        if (Email != '' && Password != '') {
            setLoading(true);
            fetch(url + 'api/user/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "email=" + Email + "&password=" + Password
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    if (json.message == "success") {
                        setLoading(false);
                        ToastAndroid.showWithGravity(
                            "Login Berhasil",
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                        );
                        storeData(json.shared_key);
                        storeDataIdUser(json.id_user);
                        storeAllDataUser(json.all);
                        getDataUser();
                        navigation.navigate('Dashboard');
                    } else {
                        setLoading(false);
                        ToastAndroid.showWithGravity(
                            "Login Gagal",
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                        );
                    }
                })
        } else {
            ToastAndroid.showWithGravity(
                "Masukkan Email & Password Anda",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    }

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('@userData', value)
        } catch (e) {
            // saving error
        }
    }
    
    const storeAllDataUser = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@AlluserData', jsonValue)
        } catch (e) {
            // saving error
        }
    }

    const storeDataIdUser = async (value) => {
        try {
            await AsyncStorage.setItem('@IDUser', value)
        } catch (e) {
            // saving error
        }
    }

    function UbahVisiblePassword1() {
        if (VisiblePassword1 == true) {
            setVisiblePassword1(false);
            setIconEye1('eye');
        } else {
            setVisiblePassword1(true);
            setIconEye1('eye-slash');
        }
    }

    function CariTukang() {
        ToastAndroid.showWithGravity(
            "Mohon Maaf, Fitur ini Masih Belum Tersedia",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
        );
    }

    return (
        <View style={styles.Container}>
            {
                isLoading
                    ? <ActivityIndicator size="large" color="#00ff00"/>
                    : (
                        <View
                            style={{
                                alignItems: 'center', justifyContent:'center'
                            }}>
                            <Image source={LogoApp} style={{width:150, height:150}} resizeMode={'contain'} />
                            <Text style={styles.TitleLogin}>Masuk Akun</Text>
                            <Text style={styles.TextTitleLogin}>Login sekarang dan kelola Tarent Outdoor</Text>
                            <View>
                                <View style={styles.IconField}>
                                    <Icon type='font-awesome-5' size={14} color='#09121F' name='envelope'/>
                                </View>
                                <TextInput
                                    style={styles.FormField}
                                    placeholder='Masukkan Email Anda'
                                    placeholderTextColor='grey'
                                    onChangeText={Email => setEmail(Email)}
                                    defaultValue={Email}></TextInput>
                            </View>
                            <View>
                                <View style={styles.IconField}>
                                    <Icon type='font-awesome-5' size={14} color='#09121F' name='lock'/>
                                </View>
                                <TextInput
                                    style={styles.FormField}
                                    placeholder='Masukkan Password'
                                    placeholderTextColor='grey'
                                    secureTextEntry={VisiblePassword1}
                                    onChangeText={Password => setPassword(Password)}
                                    defaultValue={Password}></TextInput>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 23,
                                        right: 10,
                                        zIndex: 1
                                    }}
                                    onPress={() => UbahVisiblePassword1()}>
                                    <Icon type='font-awesome-5' size={14} color='#09121F' name={IconEye1}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.ContainerBtn}>
                                <TouchableOpacity style={styles.BoxBtnMasuk} onPress={() => MasukAkun()}>
                                    <Text style={styles.TextBtnMasuk}>Masuk</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    style={styles.BoxBtnDaftar}
                                    onPress={() => navigation.navigate('Daftar')}>
                                    <Text style={styles.TextBtnDaftar}>Daftar</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    )
            }
        </View>
    )
}

export default Login
