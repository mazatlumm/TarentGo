import React, {useState, useEffect} from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native'
import {Icon} from 'react-native-elements'
import axios from 'axios'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PilihProduk = ({navigation, route}) => {
    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [DataKategori, setDataKategori] = useState([]);
    const [DaftarProduk, setDaftarProduk] = useState([]);
    const [DaftarProdukUpdate, setDaftarProdukUpdate] = useState(false);
    const [IDUser, setIDUser] = useState('');
    const [NamaPenyewa, setNamaPenyewa] = useState('');
    const [Jaminan, setJaminan] = useState('');
    const [ModalPilihBarang, setModalPilihBarang] = useState(false);
    const [NamaKategori, setNamaKategori] = useState('');
    const [JumlahItem, setJumlahItem] = useState('0');
    const [TotalHarga, setTotalHarga] = useState('0');
    const [NoHp, setNoHp] = useState('');
    
    const getDataRoutes = () => {
        if(route.params != undefined){
            setIDUser(route.params.id_user);
            setNamaPenyewa(route.params.nama_penyewa);
            setJaminan(route.params.jaminan);
            setNoHp(route.params.no_hp);
            getKategori(route.params.id_user);
        }
    }

    useEffect(() => {
        getDataRoutes();
        setDaftarProdukUpdate(!DaftarProdukUpdate);
    }, [])

    const getKategori = (id_user) => {
        return fetch(url + 'api/produk/daftar_sewa?id_user=' + id_user)
        .then((response) => response.json())
        .then((json) => {
        console.log(json.result);
        setDataKategori(json.result)
        })
        .catch((error) => {
        console.error(error);
        });
    };

    const PilihBarangPesanan = (id_Kategori, nama_kategori) => {
        // console.log(id_Kategori)
        GetDaftarBarang(id_Kategori);
        setNamaKategori(nama_kategori);
        setModalPilihBarang(!ModalPilihBarang);
    }

    const GetDaftarBarang = async (id_kategori) => {
        for (let index = 0; index < DataKategori.length; index++) {
            if(DataKategori[index].id_kategori == id_kategori){
                setDaftarProduk(DataKategori[index].list_produk);
            }
        }
    }

    const ItemKategori = ({ id_kategori, nama_kategori }) => (
        <View>
            <TouchableOpacity onPress={()=>PilihBarangPesanan(id_kategori, nama_kategori)} style={{marginHorizontal:10, marginBottom:5, backgroundColor:'#FCFCFC', borderRadius:20, paddingHorizontal:10, paddingVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>

                <View style={{alignItems:'center', justifyContent:'center', flex:1.2}}>
                    <Icon type='ionicon' name='apps' size={30} color='violet' />
                </View>
                <View style={{marginLeft:10, flex:6}}>
                    <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{nama_kategori}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderItemKategori = ({ item }) => (
        <ItemKategori 
            id_kategori={item.id_kategori}
            nama_kategori={item.nama_kategori}
        />
    );

    const FormatRupiah = (angka) => {
        var number_string = angka.replace(/[^,\d]/g, '').toString(),
			split   		= number_string.split(','),
			sisa     		= split[0].length % 3,
			rupiah     		= split[0].substr(0, sisa),
			ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
 
			// tambahkan titik jika yang di input sudah menjadi angka ribuan
			if(ribuan){
				separator = sisa ? '.' : '';
				rupiah += separator + ribuan.join('.');
			}
            var prefix = "";
			rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
			return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
    }

    const KurangiPesanan = (id_produk, id_kategori, jumlah_pesanan) => {
        let total_pesanan = jumlah_pesanan - 1;
        if(total_pesanan < 0){
            total_pesanan = 0;
        }
        // console.log(total_pesanan);
        for (let index = 0; index < DaftarProduk.length; index++) {
            if (DaftarProduk[index].id_produk == id_produk) {
                DaftarProduk[index].jumlah_pesanan = total_pesanan; 
                setDaftarProdukUpdate(!DaftarProdukUpdate);
            }
        }
        CekTotalItem();
    }

    const TambahPesanan = (id_produk, id_kategori, jumlah_pesanan) => {
        let total_pesanan = jumlah_pesanan + 1;
        // console.log(total_pesanan);
        for (let index = 0; index < DaftarProduk.length; index++) {
            if (DaftarProduk[index].id_produk == id_produk) {
                console.log(DaftarProduk[index].stok)
                if(total_pesanan <= DaftarProduk[index].stok){
                    DaftarProduk[index].jumlah_pesanan = total_pesanan; 
                }
                setDaftarProdukUpdate(!DaftarProdukUpdate);
            }
        }
        CekTotalItem();
    }

    const CekTotalItem = () => {
        let jumlah_item = 0;
        let total_harga = 0;
        for (let index = 0; index < DataKategori.length; index++) {
            const DataPesanan = (DataKategori[index].list_produk);
            for (let i = 0; i < DataPesanan.length; i++) {
                let pesanan = DataPesanan[i].jumlah_pesanan;
                let harga = DataPesanan[i].harga_sewa;
                jumlah_item = jumlah_item + pesanan;
                total_harga = total_harga + (harga * pesanan);
            }
        }
        setJumlahItem(jumlah_item);
        var FormatTotalHarga = total_harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        setTotalHarga('Rp '+FormatTotalHarga)
    }

    const ItemProduk = ({ id_produk, id_kategori, nama_produk, stok, harga_sewa, jumlah_pesanan }) => (
        <View style={{marginHorizontal:10, marginBottom:5, backgroundColor:'#F5F5F5', borderRadius:20, paddingVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:windowWidth-40}}>

            <View style={{alignItems:'center', justifyContent:'center', flex:1.2}}>
                <Icon type='ionicon' name='file-tray-full' size={30} color='violet' />
            </View>
            <View style={{marginLeft:10, flex:6}}>
                <Text style={{color:'black', fontWeight:'bold', fontFamily:'Inter-Bold', fontSize:14}}>{nama_produk}</Text>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>{FormatRupiah(harga_sewa)}</Text>
            </View>
            <View style={{flex:2, marginRight:10, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>KurangiPesanan(id_produk, id_kategori, jumlah_pesanan)}>
                    <Icon type='ionicon' name='remove-circle-outline' size={30} color='violet' style={{marginRight:5}} />
                </TouchableOpacity>
                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:16}}>{jumlah_pesanan}</Text>
                <TouchableOpacity onPress={()=>TambahPesanan(id_produk, id_kategori, jumlah_pesanan)}>
                    <Icon type='ionicon' name='add-circle-outline' size={30} color='violet' style={{marginLeft:5}} />
                </TouchableOpacity>
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

    const PeriksaPesanan = () => {
        navigation.navigate('Checkout', {checkout:DataKategori, id_user:IDUser, nama_penyewa:NamaPenyewa, jaminan:Jaminan, total_pesanan:JumlahItem, total_harga:TotalHarga, no_hp:NoHp})
    }

    return (
        <View style={{backgroundColor:'white', position:'relative', flex:1}}>
            {/* Modal Pilih Barang */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalPilihBarang}
                onRequestClose={() => {
                    setModalPilihBarang(!ModalPilihBarang);
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
                                }}>Daftar Barang "{NamaKategori}"</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 10,
                                zIndex: 10
                            }}
                            onPress={() => setModalPilihBarang(false)}>
                            <Icon type='ionicon' name='close-circle' size={30} color='black'/>
                        </TouchableOpacity>

                        {/* Daftar Barang */}
                        <FlatList
                            extraData={DaftarProdukUpdate}
                            data={DaftarProduk}
                            renderItem={renderDaftarProduk}
                            keyExtractor={item => item.id_produk}
                            style={{zIndex:10}}
                        />
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
                        }}>Pilih Produk</Text>
                </View>
            </View>
            <View style={{marginBottom:100}}>
                <FlatList
                    nestedScrollEnabled 
                    data={DataKategori}
                    renderItem={renderItemKategori}
                    keyExtractor={item => item.id_kategori}
                />
            </View>
            <TouchableOpacity onPress={()=>PeriksaPesanan()} style={{borderRadius:10, marginHorizontal:10, backgroundColor:'green', width:windowWidth-20, position:'absolute', bottom:10, left:0, alignItems:'center', justifyContent:'center', flexDirection:'row', paddingHorizontal:20}}>
                <View style={{paddingVertical:10, flex:1}}>
                    <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'white'}}>{JumlahItem} Barang</Text>
                    <Text style={{fontFamily:'Inter-Bold', fontSize:12, color:'white'}}>Periksa Pesanan</Text>
                </View>
                <View>
                    <Text style={{fontFamily:'Inter-Bold', fontSize:16, fontWeight:'bold', color:'white'}}>{TotalHarga}</Text>
                </View>
                <View style={{marginLeft:20}}>
                    <Icon type='ionicon' name='basket' size={30} color='white' />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default PilihProduk
