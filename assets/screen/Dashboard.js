import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from "react-native-bootsplash";
import styles from '../style/StyleDashboard'
import {Icon} from 'react-native-elements'
import TransactionPNG from '../icon/transaction.png'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
  var IDUser = '';

const Dashboard = ({navigation}) => {


    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [ModalTambahPesanan, setModalTambahPesanan] = useState(false);
    const [NamaPenyewa, setNamaPenyewa] = useState('');
    const [NoHP, setNoHP] = useState('');
    const [ValidasiPhone, setValidasiPhone] = useState('');
    const [Jaminan, setJaminan] = useState('');

    useEffect(() => {
        const init = async () => {
            getDataUser();
        };
        init().finally(async () => {
            await RNBootSplash.hide({ fade: true });
            console.log("Bootsplash has been hidden successfully");
        });
    }, [])

    const getDataUser = async () => {
        try {
            const value = await AsyncStorage.getItem('@userData')
            if (value !== null) {
                var shared_key = value;
                if (shared_key != null && shared_key != '') {
                    console.log('already login');
                    console.log('Shared Key: ' + shared_key);
                    getToken(shared_key);
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

    
    const getToken = async (shared_key) => {
    try {
        const response = await fetch(
        url + 'api/user/cek_token?shared_key=' + shared_key
        );
        const json = await response.json();
        IDUser = json.id_user;
        console.log(IDUser);
    } catch (error) {
        console.error(error);
    }
    };

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('@userData', value)
        } catch (e) {
            // saving error
        }
    }

    const FormatNoHp = (no_hp) => {
        setNoHP(no_hp)
        var phoneno = /^(\+62|62|0)8[1-9][0-9]{6,9}$/; 
        if(no_hp.match(phoneno)){
            console.log('no valid')
            if (no_hp.startsWith('0')) {
                no_hp = '62' + no_hp.slice(1);
                setNoHP(no_hp);
            }
            setValidasiPhone('Nomor Sesuai')
        }else{
            setValidasiPhone('Nomor Tidak Sesuai')
        }
    }

    const TambahPesanan = () => {
        setModalTambahPesanan(!ModalTambahPesanan)
        navigation.navigate('PilihKategori', {id_user: IDUser, nama_penyewa: NamaPenyewa, jaminan: Jaminan, no_hp: NoHP})
    }

    return (
        <View style={{backgroundColor:'white', position:'relative', flex:1}}>

            {/* Modal Tambah Pesanan */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={ModalTambahPesanan}
                onRequestClose={() => {
                    setModalTambahPesanan(!ModalTambahPesanan);
                }}>
                <View
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1,
                        // backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                    <View
                        style={{
                            width: '100%',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
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
                                }}>Buat Pesanan</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalTambahPesanan(false)}>
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
                                placeholder='Nama Penyewa'
                                placeholderTextColor={'grey'}
                                value={NamaPenyewa}
                                onChangeText={NamaPenyewa => setNamaPenyewa(NamaPenyewa)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <View style={{marginTop:5, alignItems:'flex-start', width:'90%', marginLeft:30}}>
                            <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular', textAlign:'left'}}>{ValidasiPhone}</Text>
                        </View>
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='No HP/WA'
                                placeholderTextColor={'grey'}
                                value={NoHP}
                                onChangeText={NoHP => FormatNoHp(NoHP)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                keyboardType={'phone-pad'}
                                />
                        </View>
                        <View
                         style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder='Jaminan'
                                placeholderTextColor={'grey'}
                                value={Jaminan}
                                onChangeText={Jaminan => setJaminan(Jaminan)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                />
                        </View>
                        <TouchableOpacity style={{backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', width:'90%', marginTop:15, marginBottom:15, borderRadius:20}} onPress={()=>TambahPesanan()}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:14}}>Lanjut Pilih Peralatan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView>
            <LinearGradient colors={['#FFF6E5', '#FFFFFF']} style={styles.BoxTopGradient}>
                <View style={{marginHorizontal:10, marginTop:10, flexDirection:'row'}}>
                    <TouchableOpacity style={{flex:1, maxWidth:45}}>
                        <View style={{borderWidth:1, height:40, width:40, borderRadius:20, borderColor:'violet', justifyContent:'center', alignItems:'center'}}>
                            <Icon type='font-awesome-5' name='user-alt' size={20} color='violet' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1, alignItems:'center'}}>
                        <View style={{borderWidth:1, borderRadius:20, borderColor:'grey', width:107, height:40, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                            <Icon type='font-awesome-5' size={10} color='violet' name='arrow-down'/>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'violet', paddingLeft:10}}>October</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1, maxWidth:45, justifyContent:'center'}}>
                        <Icon type='font-awesome' name='bell' size={30} color='violet' />
                        <View style={{borderRadius:9, backgroundColor:'red', height:18, width:18, position:'absolute', top:0, right:5, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:10}}>1</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{paddingTop:10, alignItems:'center', paddingBottom:10}}>
                    <Text style={{color:'#91919F', fontFamily:'Inter-Regular', fontSize:12}}>Total Saldo</Text>
                    <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:25}}>Rp 25.000.000</Text>
                </View>
                <View style={{flexDirection:'row', marginHorizontal:20, marginTop:10}}>
                    <View style={{height:80, backgroundColor:'#00A86B', flex:1 ,borderRadius:30, marginRight:10, alignItems:'center', paddingLeft:15, flexDirection:'row'}}>
                        <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
                            <Icon type='font-awesome-5' size={10} color='#00A86B' name='arrow-down'/>
                            <Icon type='font-awesome-5' size={15} color='#00A86B' name='money-bill-alt'/>
                        </View>
                        <View style={{marginHorizontal:10}}>
                            <Text style={{color:'white', fontFamily:'Inter-Regular', fontSize:12}}>Kredit</Text>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:12}}>250.000</Text>
                        </View>
                    </View>
                    <View style={{height:80, backgroundColor:'#fd3c4a', flex:1 ,borderRadius:30, marginLeft:10, alignItems:'center', paddingLeft:15, flexDirection:'row'}}>
                    <View style={{backgroundColor:'white', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
                            <Icon type='font-awesome-5' size={10} color='#fd3c4a' name='arrow-up'/>
                            <Icon type='font-awesome-5' size={15} color='#fd3c4a' name='money-bill-alt'/>
                        </View>
                        <View style={{marginHorizontal:10}}>
                            <Text style={{color:'white', fontFamily:'Inter-Regular', fontSize:12}}>Debit</Text>
                            <Text style={{color:'white', fontFamily:'Inter-Bold', fontSize:12}}>250.000</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
            <Text style={{fontFamily:'Inter-Bold', fontSize:16, color:'black', marginTop:5, marginBottom:10, marginLeft:10 }}>Grafik Saldo</Text>
            <View style={{marginHorizontal:5}}>
                <LineChart
                    data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
                    datasets: [
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
                        }
                    ]
                    }}
                    width={Dimensions.get("window").width-10} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 0,
                    borderRadius: 16,
                    }}
                />
            </View>

            <View style={{flexDirection:'row', marginHorizontal:10, marginTop:10}}>   
                <Text style={{fontFamily:'Inter-Bold', fontSize:16, color:'black', marginTop:5, marginBottom:10, flex:1}}>Transaksi Terakhir</Text>
                <TouchableOpacity style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                    <View style={{backgroundColor:'#EEE5FF', borderRadius:10, height:30, width:100 ,padding:5, alignItems:'center'}}>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:12, color:'violet'}}>Lihat Semua</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{paddingBottom:80, marginTop:5}}>
                <View style={{backgroundColor:'#FCFCFC', marginHorizontal:10, padding:10, height:90, borderRadius:20, flexDirection:'row', alignItems:'center', marginBottom:5}}>
                    <View style={{backgroundColor:'#FCEED4', height:60, width:60, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                        <Image source={require('../icon/transaction.png')} style={{height:50, width:50}} />
                    </View>
                    <View style={{marginHorizontal:10, width:'100%', paddingRight:80}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:2, alignItems:'flex-start'}}>
                                <Text style={{color:'black', fontSize:12, fontFamily:'Inter-Bold'}}>Tenda</Text>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <Text style={{color:'green', fontSize:12, fontFamily:'Inter-Bold'}}>+ Rp 45K</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <View style={{flex:2, alignItems:'flex-start'}}>
                                <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>Medium Size Warna Biru </Text>
                                <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>Total : 2 </Text>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>10:00 AM</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{backgroundColor:'#FCFCFC', marginHorizontal:10, padding:10, height:90, borderRadius:20, flexDirection:'row', alignItems:'center', marginBottom:5}}>
                    <View style={{backgroundColor:'#FCEED4', height:60, width:60, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                        <Image source={require('../icon/transaction.png')} style={{height:50, width:50}} />
                    </View>
                    <View style={{marginHorizontal:10, width:'100%', paddingRight:80}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:2, alignItems:'flex-start'}}>
                                <Text style={{color:'black', fontSize:12, fontFamily:'Inter-Bold'}}>Tenda</Text>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <Text style={{color:'green', fontSize:12, fontFamily:'Inter-Bold'}}>+ Rp 45K</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <View style={{flex:2, alignItems:'flex-start'}}>
                                <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>Medium Size Warna Biru </Text>
                                <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>Total : 2 </Text>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>10:00 AM</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            </ScrollView>

            <View style={{height:80, backgroundColor:'#FCFCFC', position: 'absolute', bottom:0, left:0, width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity style={{flex:1, alignItems:'center'}}>
                    <Icon type='ionicon' size={25} name='home-sharp' color='violet' />
                    <Text style={{fontFamily:'Inter-Bold', fontSize:10, color:'violet'}}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=> navigation.navigate('Kategori')}>
                    <Icon type='ionicon' size={25} name='cube-sharp' color='#C6C6C6' />
                    <Text style={{fontFamily:'Inter-Bold', fontSize:10, color:'#C6C6C6'}}>Produk</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1, alignItems:'center', marginBottom:25}} onPress={()=> setModalTambahPesanan(!ModalTambahPesanan)}>
                    <Icon type='ionicon' size={50} name='add-circle-sharp' color='violet' />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('DaftarTransaksi')} style={{flex:1, alignItems:'center'}}>
                    <Icon type='ionicon' size={25} name='bar-chart-sharp' color='#C6C6C6' />
                    <Text style={{fontFamily:'Inter-Bold', fontSize:10, color:'#C6C6C6'}}>Transaksi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
                    <Icon type='ionicon' size={25} name='person-sharp' color='#C6C6C6' />
                    <Text style={{fontFamily:'Inter-Bold', fontSize:10, color:'#C6C6C6'}}>Profile</Text>
                </TouchableOpacity>
            </View>    
        </View>
    )
}

export default Dashboard
