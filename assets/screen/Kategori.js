import React, {useState, useEffect} from 'react'
import {View, Text, Modal, TouchableOpacity, TextInput, ToastAndroid, FlatList, ScrollView, Alert} from 'react-native'
import {Icon} from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Kategori = ({navigation}) => {
    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [ModalTambahKategori, setModalTambahKategori] = useState(false);
    const [ModalEditKategori, setModalEditKategori] = useState(false);
    const [ModalHapusKategori, setModalHapusKategori] = useState(false);
    const [IDEditKategori, setIDEditKategori] = useState(false);
    const [NamaKategori, setNamaKategori] = useState('');
    const [NamaKategoriEdit, setNamaKategoriEdit] = useState('');
    const [DataKategori, setDataKategori] = useState([]);
    const [RoleUser, setRoleUser] = useState('');

    const isFocused = useIsFocused();
    useEffect(() => {
        getDataUser();
    }, [isFocused])

    const getDataUser = async () => {
        try {
            const value = await AsyncStorage.getItem('@AlluserData')
            if (value !== null) {
                var AllDataUser = JSON.parse(value);
                setRoleUser(AllDataUser[0].role);
                getKategori(AllDataUser[0].role, AllDataUser[0].id_user);
            } else {
                console.log('belum login');
            }
        } catch (e) {
            // error reading value
        }
    }

    const SimpanKategori = () => {
        if(NamaKategori != ""){
            console.log(NamaKategori);
            fetch(url + 'api/kategori', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "nama=" + NamaKategori
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    if (json.message == "success") {
                        ToastAndroid.showWithGravity(
                            "Berhasil Menambah Kategori",
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                        );
                        setNamaKategori('')
                        getKategori();
                    } else {
                        ToastAndroid.showWithGravity(
                            "Gagal Menambah Kategori",
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                        );
                        setNamaKategori('')
                    }
                })
            setModalTambahKategori(false);
        }else{
            ToastAndroid.showWithGravity(
                "Masukkan Nama Kategori",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    }

    const getKategori = (role, id_user) => {
        console.log('Get Kategori')
        console.log('role : ' + role)
        var fullURL = '';
        if(role == 'admin'){
            fullURL = url + 'api/kategori?id_user=';
            console.log('url : ' + fullURL)
        }else{
            fullURL = url + 'api/kategori?id_user=' + id_user
            console.log('url : ' + fullURL)
        }

        return fetch(fullURL)
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        setDataKategori(json.result)
        })
        .catch((error) => {
        console.error(error);
        });
    };

    const editKategori = (id_Kategori, Kategori) => {
        setModalEditKategori(!ModalEditKategori);
        setIDEditKategori(id_Kategori);
        setNamaKategoriEdit(Kategori);
    }

    const hapusKategori = (id_Kategori, Kategori) => {
        setModalHapusKategori(!ModalHapusKategori);
        setIDEditKategori(id_Kategori);
        setNamaKategoriEdit(Kategori);
    }

    const HapusKategori = (id_kategori) => {
        return fetch(url + 'api/kategori/hapus?id_kategori='+id_kategori)
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        getKategori();
        setModalHapusKategori(!ModalHapusKategori)
        })
        .catch((error) => {
        console.error(error);
        });
    }

    const SimpanEditKategori = (id_kategori) => {
        console.log(id_kategori);
        fetch(url + 'api/kategori/edit', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "id_kategori=" + id_kategori + "&kategori=" + NamaKategoriEdit
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.message == "success") {
                    ToastAndroid.showWithGravity(
                        "Berhasil Mengubah Kategori",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getKategori();
                    setModalEditKategori(!ModalEditKategori)
                } else {
                    ToastAndroid.showWithGravity(
                        "Gagal Mengubah Kategori",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                }
            })
    }

    const ItemKategori = ({ Kategori, total_produk, KategoriUpdated, id_Kategori }) => (
        <TouchableOpacity style={{marginHorizontal:10, marginBottom:5, backgroundColor:'#FCFCFC', borderRadius:20, paddingHorizontal:10, paddingVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}} onPress={()=>navigation.navigate('Produk', {KategoriId : id_Kategori, NamaKategori : Kategori})}>

            <View style={{alignItems:'center', justifyContent:'center', flex:1.2}}>
                <Icon type='ionicon' name='apps' size={40} color='violet' />
            </View>
            <View style={{marginLeft:10, flex:6}}>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{Kategori}</Text>
                <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:10}}>Total: {total_produk} Produk</Text>
            </View>
            {RoleUser ? 
                <TouchableOpacity style={{flex:1, alignItems:'flex-end'}} onPress={()=>editKategori(id_Kategori, Kategori)}>
                <Icon type='ionicon' name='create-sharp' size={25} color='violet' />
                </TouchableOpacity>
            : <View></View> }
            {RoleUser ? 
            <TouchableOpacity style={{flex:1, alignItems:'flex-end'}} onPress={()=>hapusKategori(id_Kategori, Kategori)}>
                <Icon type='ionicon' name='trash-sharp' size={25} color='violet' />
            </TouchableOpacity>
            : <View></View> }
            
        </TouchableOpacity>
    );

    const renderItemKategori = ({ item }) => (
        <ItemKategori 
            id_Kategori={item.id_kategori}
            Kategori={item.nama}
            total_produk={item.total_produk}
            KategoriCreated={item.created}
            KategoriUpdated={item.updated}
        />
    );
    
    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}>

            {/* Modal Tambah Kategori */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalTambahKategori}
                onRequestClose={() => {
                    
                    setModalTambahKategori(!ModalTambahKategori);
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
                                }}>Tambah Kategori</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalTambahKategori(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor:'grey',
                                width: '100%',
                                marginTop: 10,

                            }}/> */}
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:20, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Masukkan Nama Kategori'
                                placeholderTextColor={'grey'}
                                value={NamaKategori}
                                onChangeText={NamaKategori => setNamaKategori(NamaKategori)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>SimpanKategori()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Simpan Kategori</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Edit Kategori */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalEditKategori}
                onRequestClose={() => {
                    
                    setModalEditKategori(!ModalEditKategori);
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
                                }}>Edit Kategori</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalEditKategori(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor:'grey',
                                width: '100%',
                                marginTop: 10,

                            }}/> */}
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:20, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Masukkan Nama Kategori'
                                placeholderTextColor={'grey'}
                                value={NamaKategoriEdit}
                                onChangeText={NamaKategoriEdit => setNamaKategoriEdit(NamaKategoriEdit)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>SimpanEditKategori(IDEditKategori)}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Simpan Perubahan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Hapus Kategori */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalHapusKategori}
                onRequestClose={() => {
                    
                    setModalHapusKategori(!ModalHapusKategori);
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
                                }}>Hapus Kategori</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalHapusKategori(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor:'grey',
                                width: '100%',
                                marginTop: 10,

                            }}/> */}
                        <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:12, paddingHorizontal:10, paddingVertical:10, textAlign:'center'}}>Apakah anda yakin ingin menghapus kategori "{NamaKategoriEdit}"?</Text>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>HapusKategori(IDEditKategori)}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Iya, Hapus Kategori</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 60,
                    position: 'relative'
                }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'flex-start',
                        paddingLeft: 10
                    }}
                    onPress={() => navigation.goBack()}>
                    <Icon type={'ionicon'} name='chevron-back' size={25} color='black'/>
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingRight: 30
                    }}>
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: 'Inter-Bold',
                            fontSize: 14
                        }}>Kategori</Text>
                </View>
            </View>
            <View>
                <FlatList
                    nestedScrollEnabled 
                    data={DataKategori}
                    renderItem={renderItemKategori}
                    keyExtractor={item => item.id_kategori}
                />
            </View>
            {RoleUser ? 
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 15
                }}
                onPress={() => setModalTambahKategori(true)}>
                <Icon type='ionicon' name='add-circle' size={60} color='green'/>
            </TouchableOpacity>
            : <View></View> }
        </View>
    )
}

export default Kategori
