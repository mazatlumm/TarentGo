import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal, ToastAndroid, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import PhotoProfile from '../icon/profile.png'
import UserListIcon from '../icon/userlist.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements'
import axios from 'axios';

const Profile = ({navigation}) => {

    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [DaftarPengguna, setDaftarPengguna] = useState([]);
    const [IDUser, setIDUser] = useState('');
    const [Role, setRole] = useState('');
    const [IDUserEdit, setIDUserEdit] = useState('');
    const [DataNamaUser, setDataNamaUser] = useState('');
    const [DataUsername, setDataUsername] = useState('');
    const [DataEmailUser, setDataEmailUser] = useState('');
    const [NamaLengkap, setNamaLengkap] = useState('');
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [NamaIconPassword, setNamaIconPassword] = useState('eye-off');
    const [VisibilityPassword, setVisibilityPassword] = useState(true);
    const [ModalFormUser, setModalFormUser] = useState(false);
    const [JenisForm, setJenisForm] = useState('');
    const [EditAdmin, setEditAdmin] = useState('');

    useEffect(() => {
        getDataUser();
        getPengguna();
    }, [IDUser]);

    const getDataUser = async () => {
        try {
            const value = await AsyncStorage.getItem('@AlluserData')
            if (value !== null) {
                var AllDataUser = JSON.parse(value);
                console.log(AllDataUser[0].nama);
                setIDUser(AllDataUser[0].id_user);
                setDataNamaUser(AllDataUser[0].nama);
                setDataEmailUser(AllDataUser[0].email);
                setDataUsername(AllDataUser[0].username);
                setRole(AllDataUser[0].role);
                console.log('Role Saat ini : ' + AllDataUser[0].role)
                if(AllDataUser[0].role != 'admin'){
                    setIDUserEdit(AllDataUser[0].id_user);
                    setNamaLengkap(AllDataUser[0].nama);
                    setUsername(AllDataUser[0].username);
                    setEmail(AllDataUser[0].email);
                }
            } else {
                console.log('belum login');
                setTimeout(() => {
                    LogOut();
                }, 1000);
            }
        } catch (e) {
            // error reading value
        }
    }

    const LogOut = () => {
        HapusDataUser('');
        navigation.navigate('Login');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    const HapusDataUser = async (value) => {
        try {
            await AsyncStorage.setItem('@userData', value)
        } catch (e) {
            // saving error
        }
    }

    const LihatPassword = () => {
        setVisibilityPassword(!VisibilityPassword);
        if(VisibilityPassword == true){
            setNamaIconPassword('eye');
        }else{
            setNamaIconPassword('eye-off');
        }
    }

    const SimpanPenggunaBaru = () => {
        if(NamaLengkap != ""){
            console.log(NamaLengkap);
            fetch(url + 'api/user/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "nama=" + NamaLengkap + "&username=" + Username + "&email=" + Email + "&password=" + Password
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    if (json.message == "success") {
                        ToastAndroid.showWithGravity(
                            "Berhasil Menambah Pengguna",
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                        );
                        setNamaLengkap('')
                        setEmail('')
                        setUsername('')
                        setPassword('')
                        getPengguna();
                    } else {
                        ToastAndroid.showWithGravity(
                            "Gagal Menambah Pengguna",
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                        );
                    }
                })
            setModalFormUser(false);
        }else{
            ToastAndroid.showWithGravity(
                "Masukkan Nama Pengguna",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    }

    const getPengguna = () => {
        return fetch(url + 'api/user/list')
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        setDaftarPengguna(json.result)
        })
        .catch((error) => {
        console.error(error);
        });
    };

    const ModalEditUser = (jenisform, id_user, nama, username, email, byadmin) => {
        setIDUserEdit(id_user)
        setNamaLengkap(nama)
        setUsername(username)
        setEmail(email)
        setEditAdmin(byadmin)
        console.log('byadmin : ' + byadmin)
        if(jenisform == 'edit'){
            setJenisForm('Ubah')
        }else{
            setJenisForm('Tambah')
        }
        setModalFormUser(!ModalFormUser);
    }

    const ItemKategori = ({ id_user, nama, username, email, role }) => (
        <TouchableOpacity onPress={()=>ModalEditUser('edit', id_user, nama, username, email, role)} style={styles.BoxUserList}>
            <Image source={UserListIcon} style={styles.PhotoListUser}/>
            <Text style={styles.TextListUser}>{nama}</Text>
            <View>
                <Icon type='ionicon' name='create' size={25} color='grey'/>
            </View>
        </TouchableOpacity>
    );

    const renderDaftarUser = ({ item }) => (
        <ItemKategori 
            id_user={item.id_user}
            nama={item.nama}
            username={item.username}
            email={item.email}
            role={item.role}
        />
    );
    
    const HapusUser = async() => {
        await axios.get(url + 'api/user/hapus',{
            params: {
              id_user: IDUserEdit
            }
          })
        .then(response => {
          console.log(response.data)
          if(response.data.status == true){
            ToastAndroid.showWithGravity(
                "Berhasil Hapus Pengguna",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
            setModalFormUser(!ModalFormUser);
            getPengguna();
          }
        })
        .catch(e => {
          if (e.response.status === 404) {
            console.log(e.response.data)
            ToastAndroid.showWithGravity(
                "Gagal Hapus Pengguna",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
            getPengguna();
          }
        });
    }
    
    const UbahDataUser = async() => {
        const ParameterUrl = { 
            id_user:IDUserEdit,
            nama:NamaLengkap,
            username:Username,
            email:Email,
            password:Password,
        }
        await axios.post(url + 'api/user/ubah_user', ParameterUrl)
        .then(response => {
          console.log(response.data)
          if(response.data.status == true){
            if(Role == 'admin'){
                setModalFormUser(!ModalFormUser);
                setNamaLengkap('')
                setEmail('')
                setUsername('')
                setPassword('')
            }else{
                setDataNamaUser(NamaLengkap);
                setDataEmailUser(Email);
            }
            ToastAndroid.showWithGravity(
                "Berhasil Ubah Data Pengguna",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
            getPengguna();
          }
        })
        .catch(e => {
          if (e.response.status === 404) {
            console.log(e.response.data)
            if(Role == 'admin'){
                setModalFormUser(!ModalFormUser);
                setNamaLengkap('')
                setEmail('')
                setUsername('')
                setPassword('')
            }
            ToastAndroid.showWithGravity(
                "Gagal Ubah Data Pengguna",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
            getPengguna();
          }
        });
    }

  return (
    <View style={styles.Container}>
        {/* Modal User */}
        <Modal
                animationType="fade"
                transparent={true}
                visible={ModalFormUser}
                onRequestClose={() => {
    
                    setModalFormUser(!ModalFormUser);
                }}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)'
                    }}>
                    <View
                        style={{
                            width: '90%',
                            borderRadius: 20,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            
                        }}>
                        <View>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 14,
                                    fontFamily: 'Inter-Bold',
                                    marginTop:10
                                }}>{JenisForm} Pengguna</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalFormUser(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
    
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:20, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Nama Lengkap'
                                placeholderTextColor={'grey'}
                                value={NamaLengkap}
                                onChangeText={NamaLengkap => setNamaLengkap(NamaLengkap)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Username'
                                placeholderTextColor={'grey'}
                                value={Username}
                                onChangeText={Username => setUsername(Username)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>

                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor={'grey'}
                                value={Email}
                                onChangeText={Email => setEmail(Email)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Password'
                                placeholderTextColor={'grey'}
                                value={Password}
                                secureTextEntry={VisibilityPassword}
                                onChangeText={Password => setPassword(Password)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                                <TouchableOpacity style={{position:'absolute', top:15, right:10}} onPress={()=>LihatPassword()}>
                                    <Icon type='ionicon' name={NamaIconPassword} size={20} color='grey'/>
                                </TouchableOpacity>
                        </View>
                        
                        {IDUserEdit == undefined ?
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>SimpanPenggunaBaru()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Simpan Pengguna Baru</Text>
                        </TouchableOpacity>:
                        <View style={{width:'100%', alignItems:'center'}}>
                            {EditAdmin == null ? 
                            <View style={{width:'100%', alignItems:'center'}}>
                                <TouchableOpacity style={{backgroundColor:'orange', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>HapusUser()}>
                                    <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Hapus User</Text>
                                </TouchableOpacity>
                            </View>:
                            <View></View>
                            }
                            <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>UbahDataUser()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Ubah Pengguna</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    </View>
                </View>
        </Modal>

        <View style={styles.BoxUser}>
            <Image source={PhotoProfile} style={styles.PhotoProfile}/>
            <View style={styles.TextBoxUser}>
                <Text style={styles.NamaUser}>{DataNamaUser}</Text>
                <Text style={styles.EmailUser}>{DataEmailUser}</Text>
                <TouchableOpacity style={styles.BtnLogout} onPress={()=>LogOut()}>
                    <Text style={styles.LogoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
        {Role == 'admin' ?
        <View>
            <View style={styles.BoxBtnProfile}>
                <TouchableOpacity onPress={()=>ModalEditUser('edit', IDUser, DataNamaUser, DataUsername, DataEmailUser, 'byadmin')} style={styles.BtnSettingProfile}>
                    <Text style={styles.TextBtnSettingProfile}>Setting Profile</Text>
                </TouchableOpacity>
                <View style={{marginHorizontal:5}}></View>
                <TouchableOpacity style={styles.BtnTambahUser} onPress={()=>ModalEditUser('tambah')}>
                    <Text style={styles.TextBtnSettingProfile}>Tambah Pengguna</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop:10, paddingTop:5}}>
                <FlatList
                    nestedScrollEnabled 
                    data={DaftarPengguna}
                    renderItem={renderDaftarUser}
                    keyExtractor={item => item.id_user}
                />
            </View>
        </View>:
        <View>
            <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:20, width:'90%', marginHorizontal:20}}>
                <TextInput
                    placeholder='Nama Lengkap'
                    placeholderTextColor={'grey'}
                    value={NamaLengkap}
                    onChangeText={NamaLengkap => setNamaLengkap(NamaLengkap)}
                    style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                    />
            </View>
            
            <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                <TextInput
                    placeholder='Username'
                    placeholderTextColor={'grey'}
                    value={Username}
                    onChangeText={Username => setUsername(Username)}
                    style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                    />
            </View>

            <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                <TextInput
                    placeholder='Email'
                    placeholderTextColor={'grey'}
                    value={Email}
                    onChangeText={Email => setEmail(Email)}
                    style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                    />
            </View>
            
            <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                <TextInput
                    placeholder='Password'
                    placeholderTextColor={'grey'}
                    value={Password}
                    secureTextEntry={VisibilityPassword}
                    onChangeText={Password => setPassword(Password)}
                    style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                    />
                    <TouchableOpacity style={{position:'absolute', top:15, right:10}} onPress={()=>LihatPassword()}>
                        <Icon type='ionicon' name={NamaIconPassword} size={20} color='grey'/>
                    </TouchableOpacity>
            </View>
            
            <View style={{width:'100%', alignItems:'center'}}>
                <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>UbahDataUser()}>
                <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Ubah Data</Text>
                </TouchableOpacity>
            </View>
        </View>
        }
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
    Container:{
        backgroundColor:'white',
        flex:1,
    },
    BoxUser:{
        backgroundColor:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:10,
        marginHorizontal:10, 
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center'
    },
    BoxUserList:{
        backgroundColor:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom:10,
        marginHorizontal:10, 
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center'
    },
    PhotoProfile:{
        height:70,
        width:70
    },
    PhotoListUser:{
        height:40,
        width:40
    },
    NamaUser:{
        fontSize:16,
        color: 'black',
        fontFamily: 'Inter-Bold',
    },
    EmailUser:{
        fontSize:12,
        color: 'black',
        fontFamily: 'Inter',
    },
    TextBoxUser:{
        marginLeft:10
    },
    LogoutText:{
        fontSize:12,
        fontFamily:'Inter',
        color:'white',
        fontWeight:'bold'
    },
    BtnLogout:{
        backgroundColor:'red',
        paddingHorizontal:5,
        paddingVertical:5,
        borderRadius:10,
        width:70,
        alignItems:'center',
        marginTop:3
    },
    BoxBtnProfile:{
        flexDirection:'row',
        marginHorizontal:15,
        marginTop:10,
    },
    BtnSettingProfile:{
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:'grey',
        borderRadius:10,
        flex:1,
        alignItems:'center',
    },
    BtnTambahUser:{
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:'green',
        borderRadius:10,
        flex:1,
        alignItems:'center',
    },
    TextBtnSettingProfile:{
        fontFamily:'Inter',
        fontWeight:'bold',
        color:'white'
    },
    TextListUser:{
        fontFamily:'Inter',
        fontSize:14,
        marginLeft:15,
        color:'black',
        flex:1
    }
})