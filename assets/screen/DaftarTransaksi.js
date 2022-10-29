import { StyleSheet,View, Text, FlatList, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, LogBox, Image} from 'react-native'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Icon} from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment'
import DatePicker from 'react-native-date-picker'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DaftarTransaksi = ({navigation, route}) => {

    const [Url, setUrl] = useState('https://alicestech.com/tarent_outdoor/');
    const [IDUser, setIDUser] = useState('');
    const [Role, setRole] = useState('');
    const [DataTransakasi, setDataTransakasi] = useState([]);
    const [TanggalMulai, setTanggalMulai] = useState('');
    const [TanggalSelesai, setTanggalSelesai] = useState('');
    const [date, setDate] = useState(new Date())
    const [ModalDateTimePicker, setModalDateTimePicker] = useState(false)
    const [JenisTanggal, setJenisTanggal] = useState('')

    useEffect(() => {
        getDataUser();
        UpdateTanggal()
    }, [IDUser, Role])
    
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

    const UpdateTanggal = () => {
      var tanggal_lalu = moment().subtract(1, "days").format('YYYY-MM-D');
      var tanggal_selesai = moment().add(1, "days").format('YYYY-MM-D');
      setTanggalMulai(tanggal_lalu);
      setTanggalSelesai(tanggal_selesai);
      GetDaftarTransaksi(tanggal_lalu, tanggal_selesai);
    }

    const GetDaftarTransaksi = async(tanggal_lalu, tanggal_selesai) => {
      console.log('id_user : ' + IDUser)
      console.log('role : ' + Role)
      await axios.get(Url + 'api/transaksi',{
          params: {
            id_user: IDUser,
            role : Role,
            tanggal_lalu:tanggal_lalu,
            tanggal_selesai:tanggal_selesai,
          }
        })
      .then(response => {
          // console.log(response.data);
          if(response.data.status == true){
            setDataTransakasi(response.data.result);
          }else{
            setDataTransakasi([])
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

    const ItemDaftarTransaksi = ({ id_order, id_user, id_cabang, nama_pemesan, no_hp, jaminan, status }) => (
      <View>
        <TouchableOpacity onPress={()=>DetailTransaksi(id_order, id_user)} style={styles.Card}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{flex:1}}>
              <Text style={styles.TextNormal}>ID-ORDER #{id_order+id_user}</Text>
            </View>
            <View style={styles.CardStatus}>
              <Text style={styles.TextCardStatus}>{status}</Text>
            </View>
          </View>
          <View style={styles.LineBorder}></View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Icon type='ionicon' name={'bookmarks'} size={30} color={'green'} />
            <View style={{marginLeft:10}}>
              <Text style={styles.TextBoldNormal}>{nama_pemesan}</Text>
              <Text style={styles.TextNormal}>No HP: {no_hp}</Text>
              <Text style={styles.TextNormal}>Jaminan : {jaminan}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
    />
  );

  const AmbilTanggal = (jenis) => {
    setModalDateTimePicker(!ModalDateTimePicker);
    setJenisTanggal(jenis)
  }

  return (
    <View style={{backgroundColor:'white', flex:1}}>
      {/* Ambil tanggal */}
      <DatePicker
        modal
        open={ModalDateTimePicker}
        date={date}
        mode={'date'}
        onConfirm={(date) => {
          setModalDateTimePicker(false)
          if(JenisTanggal == 'mulai'){
            var TanggalSet = date;
            setTanggalMulai(moment(TanggalSet).format('YYYY-MM-DD'))
            GetDaftarTransaksi(moment(TanggalSet).format('YYYY-MM-DD'), TanggalSelesai)
          }
          if(JenisTanggal == 'selesai'){
            var TanggalSet = date;
            setTanggalSelesai(moment(TanggalSet).format('YYYY-MM-DD'))
            GetDaftarTransaksi(TanggalMulai, moment(TanggalSet).format('YYYY-MM-DD'))
          }
        }}
        onCancel={() => {
          setModalDateTimePicker(false)
        }}
      />
      <View
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
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
                  }}>Daftar Transaksi</Text>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('QRScannerTransaksi')} style={{justifyContent:'center', alignItems:'center', paddingRight: 10}}>
            <Icon type='font-awesome' size={25} name='qrcode' color={'black'} />
          </TouchableOpacity>
      </View>

      <View>
        <View style={styles.Card}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.TextNormal}>Tanggal : </Text>
            <TouchableOpacity onPress={()=>AmbilTanggal('mulai')} style={{borderWidth:0.3, borderRadius:10, paddingHorizontal:10, marginLeft:10, flex:2, alignItems:'center'}}>
              <Text style={styles.TextNormal}>{TanggalMulai}</Text>
            </TouchableOpacity>
            <Text style={styles.TextNormal}> -- </Text>
            <TouchableOpacity onPress={()=>AmbilTanggal('selesai')} style={{borderWidth:0.3, borderRadius:10, paddingHorizontal:10, flex:2, alignItems:'center'}}>
              <Text style={styles.TextNormal}>{TanggalSelesai}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom:100}}>
          <FlatList
              data={DataTransakasi}
              renderItem={renderDaftarTransaksi}
              keyExtractor={item => item.id_order}
          />
        </View>
      </View>
      <View style={{height:80, backgroundColor:'#FCFCFC', position: 'absolute', bottom:0, left:0, width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity onPress={()=>navigation.navigate('Dashboard')} style={{flex:1, alignItems:'center'}}>
            <Icon type='ionicon' size={25} name='home-sharp' color='#C6C6C6' />
            <Text style={{fontFamily:'Inter-Bold', fontSize:10, color:'#C6C6C6'}}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=> navigation.navigate('Kategori')}>
            <Icon type='ionicon' size={25} name='cube-sharp' color='#C6C6C6' />
            <Text style={{fontFamily:'Inter-Bold', fontSize:10, color:'#C6C6C6'}}>Produk</Text>
        </TouchableOpacity>
       
        <TouchableOpacity onPress={()=>navigation.navigate('DaftarTransaksi')} style={{flex:1, alignItems:'center'}}>
            <Icon type='ionicon' size={25} name='bar-chart-sharp' color='violet' />
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

export default DaftarTransaksi

const styles = StyleSheet.create({
  Card:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor:'white',
    borderRadius:10,
    marginVertical:5,
    marginHorizontal:20,
    paddingVertical:10,
    paddingHorizontal:20,
    width:windowWidth-35
  },
  TextBoldNormal:{
    fontFamily:'Inter-Bold',
    fontSize:14,
    color:'black',
    fontWeight:'bold'
  },
  TextNormal:{
    fontFamily:'Inter-Bold',
    fontSize:12,
    color:'black',
  },
  LineBorder:{
    borderBottomWidth:0.5,
    borderBottomColor:'black',
    width:'100%',
    marginVertical:5
  },
  CardStatus:{
    borderRadius:10,
    backgroundColor:'green',
    paddingVertical:5,
    paddingHorizontal:10
  },
  TextCardStatus:{
    fontFamily:'Inter-Bold',
    fontSize:14,
    color:'white',
  }
})