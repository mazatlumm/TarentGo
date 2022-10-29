import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput, FlatList, RefreshControl } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from "react-native-bootsplash";
import moment from 'moment';
import axios from 'axios'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import styles from '../style/StyleDashboard'
import MainStyles from '../style/Main'
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
  var Role = '';

const Dashboard = ({navigation}) => {

    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [ModalTambahPesanan, setModalTambahPesanan] = useState(false);
    const [NamaPenyewa, setNamaPenyewa] = useState('');
    const [NoHP, setNoHP] = useState('');
    const [ValidasiPhone, setValidasiPhone] = useState('');
    const [Jaminan, setJaminan] = useState('');
    const [Bulan, setBulan] = useState('');
    const [BulanValue, setBulanValue] = useState('');
    const [ModalBulan, setModalBulan] = useState('');
    const [ArrJanToJun, setArrJanToJun] = useState([0,0,0,0,0,0]);
    const [ArrJulToDes, setArrJulToDes] = useState([0,0,0,0,0,0]);
    const [ArrPendapatanYear, setArrPendapatanYear] = useState([]);
    const [RangeChart, setRangeChart] = useState(true);
    const [TotalPendapatan, setTotalPendapatan] = useState('');
    const [DataTransaksi, setDataTransaksi] = useState([]);
    const [color, changeColor] = useState('red');
    const [refreshing, setRefreshing] = React.useState(false);

    const AmbilToken = (id_user) => {
        PushNotification.configure({
        onRegister: function (token) {
            console.log("TOKEN:", token.token);
            KirimToken(id_user, token.token);
        },

        onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        onAction: function (notification) {
            console.log("ACTION:", notification.action);
            console.log("NOTIFICATION:", notification);
        },

        onRegistrationError: function(err) {
            console.error(err.message, err);
        },

        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        
        popInitialNotification: true,
        requestPermissions: true,
        });
    }

    const KirimToken = async (id_user, token) => {
        console.log('kirim token')
        const SendParams = {
            id_user: id_user,
            token: token
        }
        await axios.get(url + 'api/token',{
            params: SendParams
          })
        .then(response => {
            console.log(response);
            if(response.data.status == true){
              
            }else{
              
            }
        })
        .catch(e => {
          if (e.response.status == 404) {
            console.log(e.response.data)
          }
        });
    }

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
                    // console.log('already login');
                    // console.log('Shared Key: ' + shared_key);
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

    const FormatRupiahGo = (angka) => {
        return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    
    const getToken = async (shared_key) => {
    try {
        const response = await fetch(
        url + 'api/user/cek_token?shared_key=' + shared_key
        );
        const json = await response.json();
        IDUser = json.id_user;
        Role = json.role;
        // console.log(IDUser);

        GetDaftarTransaksi();

        moment.locale('id'); 
        var NamaBulan = moment().format('MMMM')
        var Bulan = moment().format('MM')
        setBulan(NamaBulan)
        GetPendapatan(IDUser)

        AmbilToken(IDUser);
    } catch (error) {
        console.error(error);
    }
    };

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

    const PilihBulan = (bulan) => {
        setModalBulan(!ModalBulan);
        setBulanValue(bulan);

        for (let index = 0; index < ArrPendapatanYear.length; index++) {
            if(index == bulan-1){
                console.log('Total Pendapatan Bulan ' + bulan + ' : ' + ArrPendapatanYear[index])
                setTotalPendapatan(ArrPendapatanYear[index]);
            }
        }
        if(bulan == 1){
            setBulan('Januari')
            setRangeChart(true)
        }
        if(bulan == 2){
            setBulan('Februari')
            setRangeChart(true)
        }
        if(bulan == 3){
            setBulan('Maret')
            setRangeChart(true)
        }
        if(bulan == 4){
            setBulan('April')
            setRangeChart(true)
        }
        if(bulan == 5){
            setBulan('Mei')
            setRangeChart(true)
        }
        if(bulan == 6){
            setBulan('Juni')
            setRangeChart(true)
        }
        if(bulan == 7){
            setBulan('Juli')
            setRangeChart(false)
        }
        if(bulan == 8){
            setBulan('Agustus')
            setRangeChart(false)
        }
        if(bulan == 9){
            setBulan('September')
            setRangeChart(false)
        }
        if(bulan == 10){
            setBulan('Oktober')
            setRangeChart(false)
        }
        if(bulan == 11){
            setBulan('November')
            setRangeChart(false)
        }
        if(bulan == 12){
            setBulan('Desember')
            setRangeChart(false)
        }
    }

    const GetPendapatan = async (id_user) =>{
        try {
            const response = await fetch(
            url + 'api/pendapatan?id_user='+id_user
            );
            const json = await response.json();
            // console.log(json);
            if(json.status == true){
                var dataJson = json.pendapatan;
                // console.log(dataJson);
                setArrPendapatanYear(dataJson);

                let ValBulan = moment().format('MM');
                if(ValBulan > 6){
                    setRangeChart(false);
                }else{
                    setRangeChart(true);
                }
                for (let index = 0; index < dataJson.length; index++) {
                    if(index == ValBulan-1){
                        // console.log('Total Pendapatan Bulan ' + ValBulan + ' : ' + dataJson[index])
                        setTotalPendapatan(dataJson[index]);
                    }
                }
                
                var ArrayJanToJun = [];
                var ArrayJulToDes = [];
                
                for (let index = 0; index < 6; index++) {
                    if(dataJson[index] != 0){
                        ArrayJanToJun.push(dataJson[index]/1000)
                    }else{
                        ArrayJanToJun.push(dataJson[index]);
                    }
                }
                for (let index = 6; index < 12; index++) {
                    if(dataJson[index] != 0){
                        ArrayJulToDes.push(dataJson[index]/1000)
                    }else{
                        ArrayJulToDes.push(dataJson[index]);
                    }
                }
                setArrJanToJun(ArrayJanToJun);
                setArrJulToDes(ArrayJulToDes);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const GetDaftarTransaksi = async() => {
        var tanggal_lalu = moment().subtract(1, "days").format('YYYY-MM-D');
        var tanggal_selesai = moment().add(1, "days").format('YYYY-MM-D');

        const SendParams = {
            id_user: IDUser,
            role : Role,
            tanggal_lalu:tanggal_lalu,
            tanggal_selesai:tanggal_selesai,
        }
        await axios.get(url + 'api/transaksi',{
            params: SendParams
          })
        .then(response => {
            // console.log(response.data);
            if(response.data.status == true){
              setDataTransaksi(response.data.result);
            }else{
              setDataTransaksi([])
            }
        })
        .catch(e => {
          if (e.response.status == 404) {
            console.log(e.response.data)
  
          }
        });
      }

      const DetailTransaksi = (id_order, id_user) => {
        navigation.navigate('DetailPesanan', {id_order:id_order, id_user:id_user});
      }
  
      const ItemDaftarTransaksi = ({ id_order, id_user, id_cabang, nama_pemesan, no_hp, jaminan, status, total_harga, status_sewa, updated }) => (
        <TouchableOpacity onPress={()=>DetailTransaksi(id_order, id_user)} style={{backgroundColor:'#FCFCFC', marginHorizontal:10, padding:10, height:90, borderRadius:20, flexDirection:'row', alignItems:'center', marginBottom:5}}>
            <View style={{backgroundColor:'#FCEED4', height:60, width:60, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                <Image source={require('../icon/transaction.png')} style={{height:50, width:50}} />
            </View>
            <View style={{marginHorizontal:10, width:'100%', paddingRight:80}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:2, alignItems:'flex-start'}}>
                        <Text style={{color:'black', fontSize:12, fontFamily:'Inter-Bold'}}>ID-ORDER #{id_order+id_user}</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end'}}>
                        <Text style={{color:'green', fontSize:12, fontFamily:'Inter-Bold'}}>{FormatRupiahGo(total_harga)}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{flex:2, alignItems:'flex-start'}}>
                        <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>{nama_pemesan}</Text>
                        <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>No Hp : {no_hp}</Text>
                        <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>Jaminan : {jaminan}</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end'}}>
                        <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>{status_sewa}</Text>
                        <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>{moment(new Date(updated)).format('d-MM-YYYY')}</Text>
                        <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>{moment(new Date(updated)).format('h:mm:ss')} WIB</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      );
  
    const renderDaftarTransaksi = ({ item }) => (
      <ItemDaftarTransaksi 
          id_order={item.id_order}
          id_user={item.id_user}
          id_cabang={item.id_cabang}
          nama_pemesan={item.nama_pemesan}
          no_hp={item.no_hp}
          jaminan={item.jaminan}
          status={item.status}
          total_harga={item.total_harga}
          status_sewa={item.status_sewa}
          updated={item.updated}
      />
    );

    const onRefresh = () => {
        setRefreshing(true);
        getDataUser();
        setTimeout(() => {
          changeColor('green');
          setRefreshing(false);
        }, 2000);
      };

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

            {/* Modal Bulan */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={ModalBulan}
                onRequestClose={() => {
                    setModalBulan(!ModalBulan);
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
                                }}>Pilih Bulan</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalBulan(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider10}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(1)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Januari</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(2)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Februari</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(3)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Maret</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(4)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>April</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(5)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Mei</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(6)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Juni</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(7)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Juli</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(8)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Agustus</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(9)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>September</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(10)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Oktober</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(11)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>November</Text>
                        </TouchableOpacity>
                        <View style={MainStyles.Devider5}></View>
                        <TouchableOpacity onPress={()=>PilihBulan(12)} style={MainStyles.Card}>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'black'}}>Desember</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <LinearGradient colors={['#FFF6E5', '#FFFFFF']} style={styles.BoxTopGradient}>
                <View style={{marginHorizontal:10, marginTop:10, flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('Profile')} style={{flex:1, maxWidth:45}}>
                        <View style={{borderWidth:1, height:40, width:40, borderRadius:20, borderColor:'violet', justifyContent:'center', alignItems:'center'}}>
                            <Icon type='font-awesome-5' name='user-alt' size={20} color='violet' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setModalBulan(!ModalBulan)} style={{flex:1, alignItems:'center'}}>
                        <View style={{borderWidth:1, borderRadius:20, borderColor:'grey', paddingHorizontal:10, height:40, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                            <Icon type='font-awesome-5' size={10} color='violet' name='arrow-down'/>
                            <Text style={{fontFamily:'Inter-Regular', fontSize:12, color:'violet', paddingLeft:10}}>{Bulan + ' ' + moment().format('YYYY')}</Text>
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
                    <Text style={{color:'#91919F', fontFamily:'Inter-Regular', fontSize:12}}>Total Pendapatan</Text>
                    <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:25}}>{FormatRupiahGo(TotalPendapatan)}</Text>
                </View>
            </LinearGradient>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} 
                onRefresh={onRefresh} />
            } style={{marginBottom:80}}>
                <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', marginTop:5, marginBottom:10, marginLeft:10 }}>Grafik Pendapatan</Text>
                <TouchableOpacity onPress={()=>setRangeChart(!RangeChart)} style={{marginHorizontal:5}}>
                    {RangeChart?
                        <LineChart
                            data={{
                            labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
                            datasets: [
                                {
                                data: ArrJanToJun
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width-10} // from react-native
                            height={220}
                            yAxisLabel="Rp "
                            yAxisSuffix="k"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 0, // optional, defaults to 2dp
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
                        :
                        <LineChart
                            data={{
                            labels: ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
                            datasets: [
                                {
                                data: ArrJulToDes
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width-10} // from react-native
                            height={220}
                            yAxisLabel="Rp "
                            yAxisSuffix="k"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 0, // optional, defaults to 2dp
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
                    }
                </TouchableOpacity>

                <View style={{flexDirection:'row', marginHorizontal:10, marginTop:10}}>   
                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', marginTop:5, marginBottom:10, flex:1}}>Transaksi Terakhir</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate('DaftarTransaksi')} style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                        <View style={{backgroundColor:'#EEE5FF', borderRadius:10, width:100 ,padding:5, alignItems:'center'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:12, color:'violet'}}>Lihat Semua</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {DataTransaksi.map((data_transaksi) => {
                    return (
                        <TouchableOpacity key={data_transaksi.id_order} onPress={()=>DetailTransaksi(data_transaksi.id_order, data_transaksi.id_user)} style={{backgroundColor:'#FCFCFC', marginHorizontal:10, padding:10, height:90, borderRadius:20, flexDirection:'row', alignItems:'center', marginBottom:5}}>
                        <View style={{backgroundColor:'#FCEED4', height:60, width:60, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                            <Image source={require('../icon/transaction.png')} style={{height:50, width:50}} />
                        </View>
                        <View style={{marginHorizontal:10, width:'100%', paddingRight:80}}>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex:2, alignItems:'flex-start'}}>
                                    <Text style={{color:'black', fontSize:12, fontFamily:'Inter-Bold'}}>ID-ORDER #{data_transaksi.id_order+data_transaksi.id_user}</Text>
                                </View>
                                <View style={{flex:1, alignItems:'flex-end'}}>
                                    <Text style={{color:'green', fontSize:12, fontFamily:'Inter-Bold'}}>{FormatRupiahGo(data_transaksi.total_harga)}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                <View style={{flex:2, alignItems:'flex-start'}}>
                                    <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>{data_transaksi.nama_pemesan}</Text>
                                    <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>No Hp : {data_transaksi.no_hp}</Text>
                                    <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Regular'}}>Jaminan : {data_transaksi.jaminan}</Text>
                                </View>
                                <View style={{flex:1, alignItems:'flex-end'}}>
                                    <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>{data_transaksi.status_sewa}</Text>
                                    <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>{moment(new Date(data_transaksi.updated)).format('d-MM-YYYY')}</Text>
                                    <Text style={{color:'black', fontSize:10, fontFamily:'Inter-Bold'}}>{moment(new Date(data_transaksi.updated)).format('h:mm:ss')} WIB</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    );
                })}
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
