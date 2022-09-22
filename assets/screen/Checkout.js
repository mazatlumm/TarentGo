import React, {useState, useEffect} from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, LogBox, Image, ToastAndroid } from 'react-native'
import {Icon} from 'react-native-elements'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context';

// impor icon
import BNIIcon from '../icon/bniicon.png';
import MandiriIcon from '../icon/mandiriicon.png';
import BCAIcon from '../icon/bcaicon.png';
import PermataIcon from '../icon/permataicon.png';
import BRIIcon from '../icon/briicon.png';
import GopayIcon from '../icon/gopayicon.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Checkout = ({navigation, route}) => {
    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [DataKategori, setDataKategori] = useState([]);
    const [DaftarProduk, setDaftarProduk] = useState([]);
    const [DaftarProdukUpdate, setDaftarProdukUpdate] = useState(false);
    const [IDUser, setIDUser] = useState('');
    const [IDCabang, setIDCabang] = useState('');
    const [NamaPenyewa, setNamaPenyewa] = useState('');
    const [Jaminan, setJaminan] = useState('');
    const [ModalDiskir, setModalDiskir] = useState(false);
    const [NamaModal, setNamaModal] = useState('');
    const [NamaKategori, setNamaKategori] = useState('');
    const [JumlahItem, setJumlahItem] = useState('0');
    const [TotalHarga, setTotalHarga] = useState('0');
    const [LamaSewa, setLamaSewa] = useState(1);
    const [HargaSewa, setHargaSewa] = useState('');
    const [Diskon, setDiskon] = useState(0);
    const [Ongkir, setOngkir] = useState(0);
    const [DiskirVal, setDiskirVal] = useState('');
    const [TotalPembayaran, setTotalPembayaran] = useState('');
    const [UbahTotal, setUbahTotal] = useState(false);
    const [MetodePembayaran, setMetodePembayaran] = useState('');
    const [ModalChannelPembayaran, setModalChannelPembayaran] = useState(false);
    const [NoHp, setNoHp] = useState('');
    
    const getDataRoutes = () => {
        if(route.params != undefined){
            setIDUser(route.params.id_user);
            setIDCabang(route.params.id_user);
            //karena ini adalah akun admin & cabang maka id_cabang = id_user
            setNamaPenyewa(route.params.nama_penyewa);
            setJaminan(route.params.jaminan);
            setNoHp(route.params.no_hp);
            GetDaftarBarang(route.params.checkout);
        }
    }

    useEffect(() => {
        getDataRoutes();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    const GetDaftarBarang = async (dataPesanan) => {
        for (let index = 0; index < dataPesanan.length; index++) {
            const Kategori = dataPesanan[index].list_produk;
            for (let i = 0; i < Kategori.length; i++) {
                let jumlah_pesanan = Kategori[i].jumlah_pesanan;
                if(jumlah_pesanan != 0){
                    DaftarProduk.push(Kategori[i]);
                }
            }
        }
        console.log(DaftarProduk);
        setDaftarProduk(DaftarProduk);
        HitungTotalHarga(DaftarProduk);
    }

    const HitungTotalHarga = (DaftarProduk) => {
        let total_harga = 0;
        for (let index = 0; index < DaftarProduk.length; index++) {
            let harga_sewa_cek = DaftarProduk[index].harga_sewa;
            let jumlah_pesanan_cek = DaftarProduk[index].jumlah_pesanan;
            total_harga = total_harga + (harga_sewa_cek * jumlah_pesanan_cek);
        }
        setTotalHarga(total_harga);
        let lama_sewa = LamaSewa;
        let harga_sewa = lama_sewa * total_harga;
        setHargaSewa(harga_sewa);
        HitungTotalPembayaran(harga_sewa, '', '');
    }

    FormatRupiahGo = (angka) => {
        return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    const ItemProduk = ({ id_produk, id_kategori, nama_produk, stok, harga_sewa, jumlah_pesanan }) => (
        <View style={{marginHorizontal:10, marginBottom:5, backgroundColor:'#F5F5F5', borderRadius:20, paddingVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:windowWidth-40}}>
            <View style={{alignItems:'center', justifyContent:'center', flex:1.2}}>
                <Icon type='ionicon' name='file-tray-full' size={30} color='violet' />
            </View>
            <View style={{marginLeft:10, flex:6}}>
                <Text style={{color:'black', fontWeight:'bold', fontFamily:'Inter-Bold', fontSize:14}}>{nama_produk}</Text>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{FormatRupiahGo(harga_sewa)} x {jumlah_pesanan}</Text>
            </View>
            <View style={{flex:2, marginRight:10, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{FormatRupiahGo(harga_sewa * jumlah_pesanan)}</Text>
            </View>
        </View>
    );
   
    const renderDaftarProduk = ({ item }) => (
        <ItemProduk 
            id_produk={item.id_produk}
            id_kategori={item.id_kategori}
            nama_produk={item.nama_produk}
            stok={item.stok}
            harga_sewa={item.harga_sewa}
            jumlah_pesanan={item.jumlah_pesanan}
        />
    );

    const PesanBayar = async () => {
        if(MetodePembayaran != ''){
            const ParameterUrl = { 
                id_user:IDUser,
                id_cabang:IDCabang,
                nama_pemesan:NamaPenyewa,
                no_hp:NoHp,
                jaminan:Jaminan,
                pesanan:DaftarProduk,
                metode_pembayaran:MetodePembayaran,
                lama_sewa:LamaSewa,
                diskon:Diskon,
                ongkir:Ongkir,
                admin_fee:0,
                harga_sewa:HargaSewa,
                total_harga:TotalPembayaran,
            }
            console.log(ParameterUrl);
            await axios.post(url + 'api/process_order', ParameterUrl)
            .then(response => {
              console.log(response.data)
              if(response.data.status == true){
                  var id_order = response.data.result.id_order;
                navigation.navigate('DetailPesanan', {id_user:IDUser, id_order:id_order});
                //membuat notifikasi
              }
            })
            .catch(e => {
              if (e.response.status === 404) {
                console.log(e.response.data)
              }
            });
        }else{
            ToastAndroid.showWithGravity(
                "Pilih Metode Pembayaran",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    }

    const LamaSewaGo = (jenis) => {
        let lama_sewa = LamaSewa;
        if(jenis == 'min'){
            lama_sewa = lama_sewa - 1;
        }
        if(jenis == 'plus'){
            lama_sewa = lama_sewa + 1;
        }

        if(lama_sewa < 1){
            lama_sewa = 1;
        }
        let total_harga = TotalHarga;
        let harga_sewa = total_harga * lama_sewa;
        setLamaSewa(lama_sewa);
        setHargaSewa(harga_sewa);
        HitungTotalPembayaran(harga_sewa, '', '');
    }

    const Diskir = (jenis) => {
        if(jenis == 'diskon'){
            setNamaModal('Diskon')
            setDiskirVal(Diskon)
        }
        if(jenis == 'ongkir'){
            setNamaModal('Ongkir')
            setDiskirVal(Ongkir)
        }
        setModalDiskir(!ModalDiskir);
    }

    const SimpanDiskir = () => {
        if(NamaModal == 'Diskon'){
            setDiskon(DiskirVal);
            HitungTotalPembayaran(HargaSewa, DiskirVal, '')
            console.log('Diskon : ' + DiskirVal);
        }
        if(NamaModal == 'Ongkir'){
            setOngkir(DiskirVal);
            HitungTotalPembayaran(HargaSewa, '', DiskirVal)
            console.log('Ongkir : ' + DiskirVal);
        }
        setModalDiskir(!ModalDiskir);
    }

    const HitungTotalPembayaran = (harga_sewa_go, diskonGo, ongkirGo) => {
        setUbahTotal(!UbahTotal);
        let harga_sewa = harga_sewa_go;
        let diskon = Diskon;
        let ongkir = Ongkir;
        if(diskonGo != ''){
            diskon = diskonGo;
        }
        if(ongkirGo != ''){
            ongkir = ongkirGo;
        }
        console.log('Total Pembayaran : ' + harga_sewa + ' - ' + diskon + ' + ' + ongkir)
        let total_pembayaran = parseFloat(harga_sewa) - parseFloat(diskon) + parseFloat(ongkir);
        setTotalPembayaran(total_pembayaran);
    }

    const PilihPembayaran = (jenis) => {
        setMetodePembayaran(jenis);
        setModalChannelPembayaran(!ModalChannelPembayaran);
    }

    return (
        <View style={{backgroundColor:'white', position:'relative', flex:1}}>
            {/* Modal Diskir */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalDiskir}
                onRequestClose={() => {
                    setModalDiskir(!ModalDiskir);
                }}>
                <View
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.3)'
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
                                    marginTop:10,
                                    marginBottom:10,
                                }}>{NamaModal}</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalDiskir(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>

                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:10, width:'90%', marginHorizontal:20}}>
                            <TextInput
                                placeholder={NamaModal + ' (cth. 2000)'}
                                placeholderTextColor={'grey'}
                                keyboardType='numeric'
                                onChangeText={DiskirVal => setDiskirVal(DiskirVal)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                            />
                        </View>
                        <TouchableOpacity onPress={()=>SimpanDiskir()} style={{borderRadius:10, width:'90%', marginHorizontal:20, marginVertical:10, backgroundColor:'violet', alignItems:'center', justifyContent:'center', paddingHorizontal:20, paddingVertical:10}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'white'}}>Simpan {NamaModal}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Channel Pembayaran */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalChannelPembayaran}
                onRequestClose={() => {
                    setModalChannelPembayaran(!ModalChannelPembayaran);
                }}>
                <View
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.3)'
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
                                    fontSize: 16,
                                    fontFamily: 'Inter-Bold',
                                    marginTop:10,
                                    marginBottom:20,
                                    fontWeight:'bold',
                                }}>Metode Pembayaran</Text>
                        </View>
                        
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalChannelPembayaran(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>
                        
                        <View style={{width:'100%', paddingHorizontal:20}}>
                            <TouchableOpacity onPress={()=>PilihPembayaran('BCA')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={BCAIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>BCA</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View>

                            <TouchableOpacity onPress={()=>PilihPembayaran('Mandiri')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={MandiriIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>Mandiri</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View>
                            
                            <TouchableOpacity onPress={()=>PilihPembayaran('BNI')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={BNIIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>BNI</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View>
                            
                            {/* <TouchableOpacity onPress={()=>PilihPembayaran('Permata')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={PermataIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>Permata</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View> */}

                            <TouchableOpacity onPress={()=>PilihPembayaran('BRI')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={BRIIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>BRI</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View>
                            
                            <TouchableOpacity onPress={()=>PilihPembayaran('GoPay')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={GopayIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>GoPay</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View>

                            <TouchableOpacity onPress={()=>PilihPembayaran('Tunai')} style={{flexDirection:'row', alignItems:'center'}}>
                                <Icon type={'ionicon'} name='wallet' size={25} color='green' style={{marginRight:45}}/>
                                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'black'}}>Tunai</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'grey', marginVertical:10}}></View>
                        </View>
                    </View>
                </View>
            </Modal>

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
                        }}>Pesanan Anda</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={{marginBottom:150, alignItems:'center', backgroundColor:'#F5F5F5', paddingVertical:10}}>
                <SafeAreaView style={{flex:1}}>
                    {/* Daftar Barang */}
                    <FlatList
                        extraData={DaftarProdukUpdate}
                        data={DaftarProduk}
                        renderItem={renderDaftarProduk}
                        keyExtractor={item => item.id_produk}
                        style={{zIndex:10}}
                    />
                </SafeAreaView>
                <View style={{backgroundColor:'white', borderRadius:10, shadowColor: "#000",shadowOffset: {width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, justifyContent:'center', width:windowWidth-40, paddingVertical:20, paddingHorizontal:20, marginTop:10}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Total Harga</Text>
                        </View>
                        <View>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{FormatRupiahGo(TotalHarga)}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Lama Sewa (Hari)</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>LamaSewaGo('min')}>
                                <Icon type='ionicon' name='remove-circle-outline' size={30} color='violet' style={{marginRight:5}} />
                            </TouchableOpacity>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:16}}>{LamaSewa}</Text>
                            <TouchableOpacity onPress={()=>LamaSewaGo('plus')}>
                                <Icon type='ionicon' name='add-circle-outline' size={30} color='violet' style={{marginLeft:5}} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:'100%', borderBottomWidth:0.5, borderBottomColor:'grey', marginVertical:10}}></View>
                    <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold', marginTop:10}}>Ringkasan pembayaran</Text>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Harga sewa {LamaSewa} hari</Text>
                        </View>
                        <View>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{FormatRupiahGo(HargaSewa)}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Diskon</Text>
                            <TouchableOpacity onPress={()=>Diskir('diskon')}>
                                <Icon type='ionicon' name='create' size={20} color='violet' />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, color:'red'}}>- {FormatRupiahGo(Diskon)}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Ongkir</Text>
                            <TouchableOpacity onPress={()=>Diskir('ongkir')}>
                                <Icon type='ionicon' name='create' size={20} color='violet' />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, color:'green'}}>+ {FormatRupiahGo(Ongkir)}</Text>
                        </View>
                    </View>
                    <View style={{width:'100%', borderBottomWidth:0.5, borderBottomColor:'grey', marginVertical:10}}></View>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>Total Pembayaran</Text>
                        </View>
                        <View>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>{FormatRupiahGo(TotalPembayaran)}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>setModalChannelPembayaran(!ModalChannelPembayaran)} style={{backgroundColor:'white', borderRadius:10, shadowColor: "#000",shadowOffset: {width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, justifyContent:'center', width:windowWidth-40, paddingVertical:20, paddingHorizontal:20, marginTop:10}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Metode Pembayaran</Text>
                        </View>
                        <View>
                            <Icon type='ionicon' name='chevron-down' size={20} color='grey' />
                        </View>
                    </View>
                    {MetodePembayaran == 'BCA' ?
                        <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                            <Image source={BCAIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>BCA Virtual Account</Text>
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'Mandiri' ?
                        <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                            <Image source={MandiriIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>Mandiri Virtual Account</Text>
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'BNI' ?
                        <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                            <Image source={BNIIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>BNI Virtual Account</Text>
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'GoPay' ?
                        <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                            <Image source={GopayIcon} style={{width:80, height:40, marginRight:20}} resizeMode={'contain'} />
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'BRI' ?
                        <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                            <Image source={BRIIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>BRI Virtual Account</Text>
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'Tunai' ?
                        <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                            <Icon type={'ionicon'} name='wallet' size={25} color='green' style={{marginRight:20}}/>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>Tunai</Text>
                        </View>
                        :
                        <View></View>
                    }
                </TouchableOpacity>
                <View style={{marginBottom:100}}></View>
            </ScrollView>
            <TouchableOpacity onPress={()=>PesanBayar()} style={{borderRadius:10, marginHorizontal:10, backgroundColor:'green', width:windowWidth-20, position:'absolute', bottom:10, left:0, alignItems:'center', justifyContent:'center', paddingHorizontal:20, paddingVertical:10}}>
                <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'white'}}>Pesan & Bayar Sekarang</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Checkout
