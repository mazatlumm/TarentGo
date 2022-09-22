import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ToastAndroid, Alert } from 'react-native'
import {Icon} from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Produk = ({navigation, route}) => {

    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [DataProduk, setDataProduk] = useState([]);
    const [ListDistribusiProduk, setListDistribusiProduk] = useState([]);
    const [ModalTambahProduk, setModalTambahProduk] = useState(false);
    const [ModalEditProduk, setModalEditProduk] = useState(false);
    const [ModalHapusProduk, setModalHapusProduk] = useState(false);
    const [ModalPilihAgen, setModalPilihAgen] = useState(false);
    const [ModalAturStok, setModalAturStok] = useState(false);
    const [NamaProduk, setNamaProduk] = useState(null);
    const [HargaSewa, setHargaSewa] = useState(null);
    const [IDEditProduk, setIDEditProduk] = useState(null);
    const [NamaProdukEdit, setNamaProdukEdit] = useState(null);
    const [HargaSewaProdukEdit, setHargaSewaProdukEdit] = useState(null);
    const [TotalStok, setTotalStok] = useState(null);
    const [Agen, setAgen] = useState(null);
    const [IDUser, setIDUser] = useState(null);
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
                getProduk(AllDataUser[0].role, AllDataUser[0].id_user);
            } else {
                console.log('belum login');
            }
        } catch (e) {
            // error reading value
        }
    }

    const getProduk = (role, id_user) => {
        var FullUrl = ''
        if(role != 'admin'){
            FullUrl = url + 'api/produk?id_kategori=' + route.params.KategoriId + '&id_user=' + id_user
        }else{
            FullUrl = url + 'api/produk?id_kategori=' + route.params.KategoriId + '&id_user='
        }
        console.log(FullUrl)
        return fetch(FullUrl)
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        setDataProduk(json.result)
        })
        .catch((error) => {
        console.error(error);
        });
    };

    const SimpanProduk = () => {
        fetch(url + 'api/produk', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "id_kategori=" + route.params.KategoriId + "&nama_produk=" + NamaProduk + "&harga_sewa=" + HargaSewa
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.message == "success") {
                    ToastAndroid.showWithGravity(
                        "Berhasil Menambah Produk",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getProduk(RoleUser,IDUser);
                    setNamaProduk('')
                    setHargaSewa('')
                    setModalTambahProduk(!ModalTambahProduk)
                } else {
                    ToastAndroid.showWithGravity(
                        "Gagal Menambah Produk",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getProduk(RoleUser,IDUser);
                }
            })
    }
    
    const SimpanEditProduk = () => {
        fetch(url + 'api/produk/edit', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "id_produk=" + IDEditProduk + "&nama_produk=" + NamaProdukEdit + "&harga_sewa=" + HargaSewaProdukEdit
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.message == "success") {
                    ToastAndroid.showWithGravity(
                        "Berhasil Mengubah Produk",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getProduk(RoleUser,IDUser);
                    setModalEditProduk(!ModalEditProduk)
                } else {
                    ToastAndroid.showWithGravity(
                        "Gagal Mengubah Produk",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getProduk(RoleUser,IDUser);
                }
            })
    }

    const editProduk = (id_produk, nama_produk, harga_sewa, stok) => {
        if(RoleUser){
            setModalEditProduk(!ModalEditProduk);
            setIDEditProduk(id_produk);
            setNamaProdukEdit(nama_produk);
            setHargaSewaProdukEdit(harga_sewa);
        }
    }

    const hapusProduk = (id_Produk, nama_produk) => {
        setModalHapusProduk(!ModalHapusProduk);
        setIDEditProduk(id_Produk);
        setNamaProdukEdit(nama_produk);
    }

    const HapusProduk = (id_produk) => {
        return fetch(url + 'api/produk/hapus?id_produk='+id_produk)
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        getProduk(RoleUser,IDUser);
        setModalHapusProduk(!ModalHapusProduk)
        })
        .catch((error) => {
        console.error(error);
        });
    }

    const getDistribusiProduk = () => {
        return fetch(url + 'api/produk/distribusi_list?id_produk=' + IDEditProduk)
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        setListDistribusiProduk(json.result)
        })
        .catch((error) => {
        console.error(error);
        });
    };

    const DistribusiProduk = () => {
        getDistribusiProduk();
        setModalEditProduk(!ModalEditProduk);
        setModalPilihAgen(!ModalPilihAgen);
        console.log('Data Distrbusi');
        console.log(ListDistribusiProduk);
    }

    const AturStok = (id_user, nama_agent) => {
        setIDUser(id_user);
        setAgen(nama_agent);
        setModalPilihAgen(!ModalPilihAgen);
        setModalAturStok(!ModalAturStok);
    }

    const SimpanAturProduk = () => {
        console.log("id_kategori = "+route.params.KategoriId);
        fetch(url + 'api/produk/distribusi', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "id_produk=" + IDEditProduk + "&id_kategori=" + route.params.KategoriId + "&id_user=" + IDUser + "&stok=" + TotalStok
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.message == "success") {
                    ToastAndroid.showWithGravity(
                        "Berhasil Mendistribusikan Produk",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getProduk(RoleUser,IDUser);
                    setTotalStok(null);
                    setModalAturStok(!ModalAturStok);
                } else {
                    ToastAndroid.showWithGravity(
                        "Gagal Mendistribusikan Produk",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                    );
                    getProduk(RoleUser,IDUser);
                }
            })
    }

    const ItemProduk = ({ id_produk, nama_produk, id_kategori, stok, harga_sewa, created, updated }) => (
        <TouchableOpacity style={{marginHorizontal:10, marginBottom:5, backgroundColor:'#FCFCFC', borderRadius:20, paddingHorizontal:10, paddingVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}} onPress={()=>editProduk(id_produk, nama_produk, harga_sewa, stok)}>

            <View style={{alignItems:'flex-start', justifyContent:'center', flex:1.2}}>
                <Icon type='ionicon' name='file-tray-full' size={40} color='violet' />
            </View>
            <View style={{marginLeft:10, flex:6}}>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{nama_produk}</Text>
                <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:10}}>Harga Sewa: {harga_sewa} /Hari</Text>
            </View>
            <View style={{flex:1, alignItems:'flex-end'}}>
                <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:10}}>Stok</Text>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:16}}>{stok}</Text>
            </View>
            {RoleUser ? 
            <TouchableOpacity style={{flex:1, alignItems:'flex-end'}} onPress={()=>hapusProduk(id_produk, nama_produk)}>
                <Icon type='ionicon' name='trash-sharp' size={25} color='violet' />
            </TouchableOpacity>
            : <View></View> }
        </TouchableOpacity>
    );
    
    const ItemDistribusi = ({id_user, nama_agent, stok}) => (
        <TouchableOpacity style={{marginHorizontal:10, marginBottom:5, backgroundColor:'#FCFCFC', borderRadius:20, paddingHorizontal:10, paddingVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}} onPress={()=>AturStok(id_user, nama_agent)}>
            <View style={{alignItems:'flex-start', justifyContent:'center', flex:1.2}}>
                <Icon type='ionicon' name='person-circle' size={20} color='violet' />
            </View>
            <View style={{marginLeft:10, flex:6}}>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:12}}>{nama_agent}</Text>
            </View>
            <View style={{flex:1, alignItems:'flex-end'}}>
                <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:10}}>Stok</Text>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:16}}>{stok}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItemProduk = ({ item }) => (
        <ItemProduk 
            id_produk={item.id_produk}
            id_kategori={item.id_kategori}
            nama_produk={item.nama_produk}
            harga_sewa={item.harga_sewa}
            stok={item.stok}
            created={item.created}
            updated={item.updated}
        />
    );
    
    const renderItemDistribusi = ({ item }) => (
        <ItemDistribusi 
            id_user={item.id_user}
            nama_agent={item.nama_agent}
            stok={item.stok}
        />
    );

    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}>
            
            {/* Modal Tambah Produk */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalTambahProduk}
                onRequestClose={() => {
                    
                    setModalTambahProduk(!ModalTambahProduk);
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
                                }}>Tambah Produk</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalTambahProduk(false)}>
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
                                placeholder='Nama Produk'
                                placeholderTextColor={'grey'}
                                value={NamaProduk}
                                onChangeText={NamaProduk => setNamaProduk(NamaProduk)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Harga Sewa'
                                placeholderTextColor={'grey'}
                                value={HargaSewa}
                                keyboardType='numeric'
                                onChangeText={HargaSewa => setHargaSewa(HargaSewa)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>SimpanProduk()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Simpan Produk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Edit Produk */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalEditProduk}
                onRequestClose={() => {
                    
                    setModalEditProduk(!ModalEditProduk);
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
                                }}>Detil Produk</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalEditProduk(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor:'grey',
                                width: '100%',
                                marginTop: 10,

                            }}/> */}
                        <Text style={{color:'grey', fontFamily:'Inter-Regular', fontSize:12, paddingHorizontal:15, paddingVertical:10, textAlign:'center'}}>Anda dapat melakukan perubahan pada produk ini</Text>
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Nama Produk'
                                placeholderTextColor={'grey'}
                                value={NamaProdukEdit}
                                onChangeText={NamaProdukEdit => setNamaProdukEdit(NamaProdukEdit)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Harga Sewa'
                                placeholderTextColor={'grey'}
                                value={HargaSewaProdukEdit}
                                keyboardType='numeric'
                                onChangeText={HargaSewaProdukEdit => setHargaSewaProdukEdit(HargaSewaProdukEdit)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>

                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>SimpanEditProduk()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Simpan Perubahan</Text>
                        </TouchableOpacity>
                        <Text style={{color:'grey', fontFamily:'Inter-Regular', fontSize:12, paddingHorizontal:15, paddingVertical:10, textAlign:'center'}}>Anda harus mendistribusikan produk ini ke setiap agen Terent Outdoor, klik tombol dibawah ini!</Text>
                        <TouchableOpacity style={{backgroundColor:'orange', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:0, borderRadius:20}} onPress={()=>DistribusiProduk()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Distribusikan Produk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Hapus Produk */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalHapusProduk}
                onRequestClose={() => {
                    
                    setModalHapusProduk(!ModalHapusProduk);
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
                                }}>Hapus Produk</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalHapusProduk(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor:'grey',
                                width: '100%',
                                marginTop: 10,

                            }}/> */}
                        <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:12, paddingHorizontal:10, paddingVertical:10, textAlign:'center'}}>Apakah anda yakin ingin menghapus Produk "{NamaProdukEdit}"?</Text>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>HapusProduk(IDEditProduk)}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Iya, Hapus Produk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Pilih Agen */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalPilihAgen}
                onRequestClose={() => {
                    
                    setModalPilihAgen(!ModalPilihAgen);
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
                                }}>Distribusi Produk</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalPilihAgen(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor:'grey',
                                width: '100%',
                                marginTop: 10,

                            }}/> */}
                        <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:12, paddingHorizontal:10, paddingVertical:10, textAlign:'center'}}>Silahkan pilih nama agen di bawah ini</Text>
                        <View style={{height:200, width:300}}>
                            <FlatList
                                nestedScrollEnabled
                                data={ListDistribusiProduk}
                                renderItem={renderItemDistribusi}
                                keyExtractor={item => item.id_user}
                            />
                        </View>

                    </View>
                </View>
            </Modal>

            {/* Modal Atur Stok Produk */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalAturStok}
                onRequestClose={() => {
                    
                    setModalAturStok(!ModalAturStok);
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
                                }}>Distribusi Jumlah Stok</Text>
                        </View>
                        <Text style={{color:'black', fontFamily:'Inter-Regular', fontSize:12, paddingHorizontal:10, paddingTop:10, textAlign:'center'}}>Nama Agen: {Agen}</Text>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalAturStok(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Total Stok'
                                placeholderTextColor={'grey'}
                                value={TotalStok}
                                keyboardType='numeric'
                                onChangeText={TotalStok => setTotalStok(TotalStok)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, borderRadius:20}} onPress={()=>SimpanAturProduk()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Simpan</Text>
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
                        }}>{route.params.NamaKategori}</Text>
                </View>
            </View>
            <View>
            <FlatList
                nestedScrollEnabled
                data={DataProduk}
                renderItem={renderItemProduk}
                keyExtractor={item => item.id_produk}
            />
            </View>
            {RoleUser ? 
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 15
                }}
                onPress={() => setModalTambahProduk(true)}>
                <Icon type='ionicon' name='add-circle' size={60} color='green'/>
            </TouchableOpacity>
            : <View></View> }
        </View>
    )
}

export default Produk
