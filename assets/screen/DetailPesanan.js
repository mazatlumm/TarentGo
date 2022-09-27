import React, {useState, useEffect} from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, LogBox, Image, PermissionsAndroid, Platform, ToastAndroid } from 'react-native'
import axios from 'axios'
import {Icon} from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import QRCode from 'react-native-qrcode-svg';

// impor icon
import BNIIcon from '../icon/bniicon.png';
import MandiriIcon from '../icon/mandiriicon.png';
import BCAIcon from '../icon/bcaicon.png';
import PermataIcon from '../icon/permataicon.png';
import BRIIcon from '../icon/briicon.png';
import GopayIcon from '../icon/gopayicon.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DetailPesanan = ({navigation, route}) => {
    const [url, seturl] = useState('https://alicestech.com/tarent_outdoor/');
    const [DataKategori, setDataKategori] = useState([]);
    const [DaftarProduk, setDaftarProduk] = useState([]);
    const [DaftarProdukUpdate, setDaftarProdukUpdate] = useState(false);
    const [IDUser, setIDUser] = useState('');
    const [IDCabang, setIDCabang] = useState('');
    const [IDOrder, setIDOrder] = useState('');
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
    const [TanggalTransaksi, setTanggalTransaksi] = useState('');
    const [ExpiredDate, setExpiredDate] = useState('');
    const [StatusTransaksi, setStatusTransaksi] = useState(false);
    const [VirtualAcoount, setVirtualAcoount] = useState('');
    const [BillCode, setBillCode] = useState('');
    const [BillKey, setBillKey] = useState('');
    const [UrlQRCodeGoPay, setUrlQRCodeGoPay] = useState('');
    const [DeepLinkGoPay, setDeepLinkGoPay] = useState('');
    const [copiedText, setCopiedText] = useState('');
    const [CaraPembayaranMandiri, setCaraPembayaranMandiri] = useState(false);
    const [ATMMandiri, setATMMandiri] = useState(false);
    const [InternetBankingMandiri, setInternetBankingMandiri] = useState(false);
    const [CaraPembayaranBCA, setCaraPembayaranBCA] = useState(false);
    const [ATMBCA, setATMBCA] = useState(false);
    const [KlikBCA, setKlikBCA] = useState(false);
    const [mBCA, setmBCA] = useState(false);
    const [CaraPembayaranBNI, setCaraPembayaranBNI] = useState(false);
    const [ATMBNI, setATMBNI] = useState(false);
    const [IBBNI, setIBBNI] = useState(false);
    const [MBBNI, setMBBNI] = useState(false);
    const [CaraPembayaranBRI, setCaraPembayaranBRI] = useState(false);
    const [ATMBRI, setATMBRI] = useState(false);
    const [IBBRI, setIBBRI] = useState(false);
    const [MBBRI, setMBBRI] = useState(false);
    const [CaraPembayaranGoPay, setCaraPembayaranGoPay] = useState(false);
    const [Interval1, setInterval1] = useState('');
    const [Interval2, setInterval2] = useState('');
    const [Interval3, setInterval3] = useState('');
    const [TanggalPengembalian, setTanggalPengembalian] = useState('');
    const [TotalDenda, setTotalDenda] = useState('');
    const [filePath, setFilePath] = useState('');
    const [HTMLCode, setHTMLCode] = useState('');
    const [LoopStruk, setLoopStruk] = useState('');
    const [TanggalSewa, setTanggalSewa] = useState('');
    const [StatusSewa, setStatusSewa] = useState('');
    const [ModalTungguVerifikasi, setModalTungguVerifikasi] = useState(false);
    
    const getDataRoutes = () => {
        if(route.params != undefined){
            setIDUser(route.params.id_user);
            setIDOrder(route.params.id_order);
            GetDaftarBarang(route.params.id_order);
        }
    }

    const isPermitted = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'External Storage Write Permission',
                message: 'App needs access to Storage data',
              },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            alert('Write permission err', err);
            return false;
          }
        } else {
          return true;
        }
    };

    const createPDF = async () => {
        if (await isPermitted()) {
            let options = {
                //Content to print
                html:HTMLCode,
                //File Name
                fileName: `${NamaPenyewa}-${TanggalPengembalian}`,
                //File directory
                directory: 'docs',
            };
            let file = await RNHTMLtoPDF.convert(options);
            console.log(file.filePath);
            setFilePath(file.filePath);
            ToastAndroid.showWithGravity(
                "Berhasil Mengunduh Bukti Pemesanan",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
        }
    };

    const CountDown = () => {
        if(TanggalTransaksi != '' && StatusTransaksi == false){
            console.log('countdown all')
            const tanggalPayment = new Date(TanggalTransaksi);
            tanggalPayment.setDate(tanggalPayment.getDate() + 1);

            var countDownDate = tanggalPayment.getTime();

            var x = setInterval(() => {
                var now = new Date().getTime();
                var distance = countDownDate - now;

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setExpiredDate(hours+'j '+minutes+'m '+seconds+'d');

                if (distance < 0) {
                    clearInterval(x);
                    setExpiredDate('Expired')
                }
                if(StatusTransaksi){
                    console.log('interval_id : ' + x);
                    setInterval1(x);
                    console.log(StatusTransaksi)
                    clearInterval(x);
                }
            }, 1000);
        }
    }
    
    const CountDownGoPay = () => {
        console.log('countdown gopay')
        if(TanggalTransaksi != '' && StatusTransaksi == false){
            const tanggalPayment = new Date(TanggalTransaksi);
            var countDownDate = tanggalPayment.getTime()+(15 * 60 * 1000);

            var x = setInterval(() => {
                var now = new Date().getTime();
                var distance = countDownDate - now;

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setExpiredDate(hours+'j '+minutes+'m '+seconds+'d');

                if (distance < 0) {
                    clearInterval(x);
                    setExpiredDate('Expired')
                }
                if(StatusTransaksi != ''){
                    console.log('interval_id : ' + x);
                    setInterval2(x);
                    console.log(StatusTransaksi)
                    clearInterval(x);
                }
            }, 1000);
        }
    }

    const LoopingGetData = () => {
        if(StatusTransaksi == false){
            var x = setInterval(() => {
                console.log('looping get data')
                GetDaftarBarang(IDOrder)
                if(StatusTransaksi){
                    console.log('interval_id : ' + x);
                    setInterval3(x);
                    console.log(StatusTransaksi)
                    clearInterval(x);
                }
            }, 5000);
        }
    }

    useEffect(() => {
        getDataRoutes();
        LoopingGetData();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [TanggalTransaksi])

    const GetDaftarBarang = async (id_order) => {
        await axios.get(url + 'api/detail_pesanan',{
            params: {
              id_order: id_order
            }
          })
        .then(response => {
            if(response.data.status == true){
                console.log(response.data.result)
                setNamaPenyewa(response.data.result.nama_pemesan);
                setStatusSewa(response.data.result.status_sewa)
                if(response.data.result.denda == null){
                    setTotalDenda(0)
                }else{
                    setTotalDenda(response.data.result.denda)
                }
                var daftar_produk = response.data.result.pesanan;
                var harga_sewa = response.data.result.harga_sewa;
                var lama_sewa = response.data.result.lama_sewa;
                var diskon = response.data.result.diskon;
                var ongkir = response.data.result.ongkir;
                var total_harga = response.data.result.total_harga;
                var metode_pembayaran = response.data.result.metode_pembayaran;
                var status_transaksi = response.data.result.status;
                console.log('status_transaksi : ' + status_transaksi);
                if(status_transaksi == 'settlement'){
                    setStatusTransaksi(true);
                    clearInterval(Interval1);
                    clearInterval(Interval2);
                    clearInterval(Interval3);
                    console.log('ubah status transaksi');
                }
                if(status_transaksi == 'pending'){
                    setStatusTransaksi(false)
                }
                
                if(metode_pembayaran == 'BCA' || metode_pembayaran == 'BNI' || metode_pembayaran == 'BRI'){
                    var transaction_time = response.data.result.payment_response.transaction_time;
                    var va_numbers = response.data.result.payment_response.va_numbers;
                    setVirtualAcoount(va_numbers[0].va_number);
                    setTanggalTransaksi(transaction_time);
                    CountDown();
                }
                if(metode_pembayaran == 'Mandiri'){
                    var bill_key = response.data.result.payment_response.bill_key;
                    var biller_code = response.data.result.payment_response.biller_code;
                    var transaction_time = response.data.result.payment_response.transaction_time;
                    setBillCode(biller_code);
                    setBillKey(bill_key);
                    setTanggalTransaksi(transaction_time);
                    CountDown();
                }

                if(metode_pembayaran == 'GoPay'){
                    var transaction_time = response.data.result.payment_response.transaction_time;
                    CountDownGoPay();
                    setTanggalTransaksi(transaction_time);
                    var actions = response.data.result.payment_response.actions;
                    for (let index = 0; index < actions.length; index++) {
                        var name = actions[index].name;
                        if(name == 'generate-qr-code'){
                            var url_qrcode_gopay = actions[index].url
                            console.log('qrcode gopay : ' + url_qrcode_gopay)
                            setUrlQRCodeGoPay(url_qrcode_gopay);
                        }
                        if(name == 'deeplink-redirect'){
                            var deeplink_gopay = actions[index].url
                            console.log('deeplink gopay : ' + deeplink_gopay)
                            setDeepLinkGoPay(deeplink_gopay);
                        }
                    }
                }

                if(metode_pembayaran == 'Tunai'){
                    var transaction_time = response.data.result.created;
                    setTanggalTransaksi(transaction_time);
                    CountDown();
                }

                const current = new Date(TanggalTransaksi);
                current.setDate(current.getDate()+parseInt(lama_sewa));
                var datetime = current.getDate() + "-"
                        + (current.getMonth()+1)  + "-" 
                        + current.getFullYear() + " Pukul: "  
                        + current.getHours() + ":"  
                        + current.getMinutes() + ":" 
                        + current.getSeconds() + " WIB";
                setTanggalPengembalian(datetime);

                const tanggal_transaksi = new Date(response.data.result.updated);
                var tanggal_sewa = tanggal_transaksi.getDate() + "-"
                        + (tanggal_transaksi.getMonth()+1)  + "-" 
                        + tanggal_transaksi.getFullYear() + " Pukul: "  
                        + tanggal_transaksi.getHours() + ":"  
                        + tanggal_transaksi.getMinutes() + ":" 
                        + tanggal_transaksi.getSeconds() + " WIB";
                setTanggalSewa(tanggal_sewa);

                setNoHp(response.data.result.no_hp)
                setHargaSewa(harga_sewa);
                setLamaSewa(lama_sewa);
                setDiskon(diskon);
                setOngkir(ongkir);
                setTotalPembayaran(total_harga);
                setMetodePembayaran(metode_pembayaran);
                setDaftarProduk(daftar_produk);
                HitungTotalHarga(daftar_produk);
                let nomor_urut = 1;
                var daftar_barang = ``;
                for (let index = 0; index < daftar_produk.length; index++) {
                    const nama_produk = daftar_produk[index].nama_produk;
                    let jumlah_pesanan = daftar_produk[index].jumlah_pesanan;
                    let harga_sewa = daftar_produk[index].harga_sewa;
                    daftar_barang += `<tr style="border:0.5px solid black;">
                    <td style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${nomor_urut++}.</td>
                    <td style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${nama_produk}</td>
                    <td style="text-align: right; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${jumlah_pesanan} pcs</td>
                    <td style="text-align: right; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${FormatRupiahGo(harga_sewa)}</td>
                </tr>`
                }
                setLoopStruk(daftar_barang);
            }
        })
        .catch(e => {
          if (e.response.status === 404) {
            console.log(e.response.data)

          }
        });
    }

    const HitungTotalHarga = (DaftarProduk) => {
        let total_harga = 0;
        for (let index = 0; index < DaftarProduk.length; index++) {
            let harga_sewa_cek = DaftarProduk[index].harga_sewa;
            let jumlah_pesanan_cek = DaftarProduk[index].jumlah_pesanan;
            total_harga = total_harga + (harga_sewa_cek * jumlah_pesanan_cek);
        }
        setTotalHarga(total_harga);
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

    const copyToClipboard = (data) => {
        Clipboard.setString(data);
      };
    
    const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
    console.log(copiedText);
    };

    const CekCaraPembayaranMandiri = (jenis) => {
        if(jenis == 'ATM'){
            setATMMandiri(!ATMMandiri);
            setInternetBankingMandiri(false);
        }
        if(jenis == 'IB'){
            setATMMandiri(false);
            setInternetBankingMandiri(!InternetBankingMandiri);
        }
    }
    
    const OpenCaraPembayaran = (jenis) => {
        if(jenis == 'BCA'){
          setCaraPembayaranBCA(!CaraPembayaranBCA);
        }
        if(jenis == 'BNI'){
          setCaraPembayaranBNI(!CaraPembayaranBNI);
        }
        if(jenis == 'BRI'){
          setCaraPembayaranBRI(!CaraPembayaranBRI);
        }
    }

    const CekCaraPembayaranBCA = (jenis) => {
        if(jenis == 'ATM'){
            setATMBCA(!ATMBCA);
            setKlikBCA(false);
            setmBCA(false)
        }
        if(jenis == 'KBCA'){
            setATMBCA(false);
            setKlikBCA(!KlikBCA);
            setmBCA(false)
        }
        if(jenis == 'mBCA'){
            setATMBCA(false);
            setKlikBCA(false);
            setmBCA(!mBCA)
        }
    }
    
    const CekCaraPembayaranBNI = (jenis) => {
        if(jenis == 'ATM'){
            setATMBNI(!ATMBNI);
            setIBBNI(false);
            setMBBNI(false);
        }
        if(jenis == 'IBBNI'){
            setATMBNI(false);
            setIBBNI(!IBBNI);
            setMBBNI(false);
        }
        if(jenis == 'MBBNI'){
            setATMBNI(false);
            setIBBNI(false);
            setMBBNI(!MBBNI);
        }
    }
    
    const CekCaraPembayaranBRI = (jenis) => {
        if(jenis == 'ATM'){
            setATMBRI(!ATMBRI);
            setIBBRI(false);
            setMBBRI(false);
        }
        if(jenis == 'IBBRI'){
            setATMBRI(false);
            setIBBRI(!IBBRI);
            setMBBRI(false);
        }
        if(jenis == 'MBBRI'){
            setATMBRI(false);
            setIBBRI(false);
            setMBBRI(!MBBRI);
        }
    }

    const VerifikasiPembayaranTunai = async() => {
        setModalTungguVerifikasi(true);
        await axios.get(url + 'api/payment/verifikasi',{
            params: {
              id_order: IDOrder
            }
          })
        .then(response => {
            setModalTungguVerifikasi(false);
            if(response.data.status == true){
                console.log(response.data);
            }
        })
        .catch(e => {
          if (e.response.status === 404) {
            console.log(e.response.data)
            setModalTungguVerifikasi(false);
          }
        });
    }

    const VerPengembalianBarang = async () => {
        console.log('Verifikasi Pengembalian Barang')
        const ParameterUrl = { 
            id_user:IDUser,
            id_order:IDOrder,
            denda:TotalDenda,
        }
        console.log(ParameterUrl);
        await axios.post(url + 'api/verifikasi_pengembalian', ParameterUrl)
        .then(response => {
          console.log(response.data)
          if(response.data.status == true){
            GetDaftarBarang(IDOrder);
          }
        })
        .catch(e => {
          if (e.response.status === 404) {
            console.log(e.response.data)
          }
        });
    }

    const GetImageQR = (c) => {
        if(c){
            c.toDataURL((data) => {
                HalamanHTMLStruk(data)
            });
        }
    }

    const HalamanHTMLStruk = (Base64QRCode) => {
        var html_struk = `<img src="data:image/jpeg;base64,${Base64QRCode}" style="width: 150px; display: block; margin-left: auto; margin-right: auto;" alt="" srcset="">
        <h2 style="text-align: center;"><strong>ORDER ID #${IDOrder+IDUser}</strong></h2>
        <p style="text-align: center;">Berikut ini adalah detail pesanan Anda:</p>
        <table style="border:0.5px solid black;margin-left:auto;margin-right:auto; padding:10px; border-collapse: collapse;">
            <tr style="border:0.5px solid black;">
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">No</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Nama Barang</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Jumlah</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Harga Sewa</th>
            </tr>
            ${LoopStruk}
        </table>
        <br>
        <table style="border:0.5px solid black;margin-left:auto;margin-right:auto; padding:10px; border-collapse: collapse;">
            <tr style="border:0.5px solid black;">
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Lama Sewa</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${LamaSewa} hari</th>
            </tr>
            <tr style="border:0.5px solid black;">
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Total Pembayaran</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${FormatRupiahGo(TotalPembayaran)}</th>
            </tr>
        </table>
        <br>
        <table style="border:0.5px solid black;margin-left:auto;margin-right:auto; padding:10px; border-collapse: collapse;">
            <tr style="border:0.5px solid black;">
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Nama Pemesan</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${NamaPenyewa}</th>
            </tr>
            <tr style="border:0.5px solid black;">
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Waktu Pemesanan</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${TanggalSewa}</th>
            </tr>
            <tr style="border:0.5px solid black;">
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">Waktu Pengembalian</th>
                <th style="text-align: left; padding-left: 10px; padding-right: 10px; padding-top:5px; padding-bottom:5px; font-size: 14px;">${TanggalPengembalian}</th>
            </tr>
        </table>
        <br>
        <p style="text-align: center;">Terimakasih telah menyewa barang di Tarent Outdoor.</p>
        `
        setHTMLCode(html_struk)
    }

    const DetilPembayaran = () => {
        return (
            <View>
                <View style={{marginTop:10, flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>Total</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(TotalPembayaran)}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:18, fontWeight:'bold', color:'black'}}>{FormatRupiahGo(TotalPembayaran)}</Text>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>order ID #{IDOrder+IDUser}</Text>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                        {StatusTransaksi == false ?
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'grey'}}>bayar dalam</Text>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'green', fontWeight:'bold'}}>{ExpiredDate}</Text>
                        </View>:
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'grey'}}>status pembayaran</Text>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'green', fontWeight:'bold'}}>SELESAI</Text>
                        </View>
                    }
                    </View>
                </View>
                <View style={{width:'100%', borderBottomWidth:0.5, borderBottomColor:'grey', marginVertical:10}}></View>
                {VirtualAcoount != '' ?
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>No VA : </Text>
                            <View>
                                <Text selectable={true} style={{fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold', color:'black'}}>{VirtualAcoount}</Text>
                            </View>
                        </View>

                        {/* Cara Pembayaran BCA */}
                        <TouchableOpacity onPress={()=> OpenCaraPembayaran(MetodePembayaran)} style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'#009dff', fontWeight:'bold'}}>Cara Pembayaran 
                            </Text>
                            <Icon type='ionicon'  name='list' color={'#009dff'} size={18} style={{marginLeft:10}} />
                        </TouchableOpacity>

                        {CaraPembayaranBCA ? 
                        <View style={{marginTop:10}}>
                            {/* ATM BCA */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBCA('ATM')} style={{flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>ATM BCA</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>
                            {ATMBCA ?
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select other transactions on the main menu..</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select transfer.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Select to BCA virtual account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert BCA Virtual account number.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Insert the payable amount, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>6. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* Klik BCA */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBCA('KBCA')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>Klik BCA</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {KlikBCA ? 
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select fund transfer.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select transfer to BCA virtual account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Insert BCA virtual account number.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert the payable amount, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* m-BCA */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBCA('mBCA')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>m-BCA</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {mBCA ? 
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select m-Transfer.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select BCA virtual account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Insert BCA virtual account number.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert the payable amount, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                        </View>
                        :
                        <View></View>  
                        }

                        {CaraPembayaranBNI ? 
                        <View style={{marginTop:10}}>
                            {/* ATM BNI */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBNI('ATM')} style={{flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>ATM BNI</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>
                            {ATMBNI ?
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select others on the main menu.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select transfer.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Select to BNI account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert the payment account number.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Insert the payable amount, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>6. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* Internet Banking BNI */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBNI('IBBNI')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>Internet Banking</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {IBBNI ? 
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select transaction, then transfer administration info.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select set destination account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Insert account info, then Confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Select transfer, then transfer to BNI account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Insert payment details, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>6. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* Mobile Banking BNI */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBNI('MBBNI')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>Mobile Banking</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {MBBNI ? 
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select transfer.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select virtual account billing.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Select the debit account you want to use.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert the virtual account number, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                        </View>
                        :
                        <View></View>  
                        }

                        {CaraPembayaranBRI ? 
                        <View style={{marginTop:10}}>
                            {/* ATM BRI */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBRI('ATM')} style={{flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>ATM BRI</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>
                            {ATMBRI ?
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select others on the main menu.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select payment.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Select other.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert BRIVA.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Insert BRIVA number, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>6. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* Internet Banking BNI */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBRI('IBBRI')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>IB BRI</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {IBBRI ? 
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select payment & purchase.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select BRIVA.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Insert BRIVA Number, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* Mobile Banking BRI */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranBRI('MBBRI')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>BRImo</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {MBBRI ? 
                                 <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select payment & purchase.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select BRIVA.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Insert BRIVA Number, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                        </View>
                        :
                        <View></View>  
                        }
                    </View>
                    :
                    <View></View>
                }
                
                {BillCode != '' ?
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>Kode Pembayaran : </Text>
                            <View>
                                <Text selectable={true} style={{fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold', color:'black'}}>{BillCode}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>No VA : </Text>
                            <View>
                                <Text selectable={true} style={{fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold', color:'black'}}>{BillKey}</Text>
                            </View>
                        </View>

                        {/* Cara Pembayaran Mandiri */}
                        <TouchableOpacity onPress={()=> setCaraPembayaranMandiri(!CaraPembayaranMandiri)} style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'#009dff', fontWeight:'bold'}}>Cara Pembayaran 
                            </Text>
                            <Icon type='ionicon'  name='list' color={'#009dff'} size={18} style={{marginLeft:10}} />
                        </TouchableOpacity>

                        {CaraPembayaranMandiri ? 
                        <View style={{marginTop:10}}>
                            {/* ATM Mandiri */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranMandiri('ATM')} style={{flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>ATM Mandiri</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>
                            {ATMMandiri ?
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select Pay/Buy on the main menu.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select Others.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Select Multi Payment.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Insert company code 70012.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Insert virtual account number, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>6. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                            
                            {/* Internet Banking Mandiri */}
                            <TouchableOpacity onPress={()=>CekCaraPembayaranMandiri('IB')} style={{flexDirection:'row', marginTop:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>Internet Banking</Text>
                                </View>
                                <Icon type='ionicon'  name='chevron-down' color={'black'} size={20} />
                            </TouchableOpacity>

                            {InternetBankingMandiri ? 
                            
                                <View>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Select Payment on the main menu.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Select Multi Payment.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Select From account.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Select Midtrans in the Service provider field.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>5. Insert virtual account number, then confirm.</Text>
                                    <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>6. Payment complete.</Text>
                                </View>
                                :
                                <View></View>
                            }
                        </View>
                        :
                        <View></View>  
                    }
                    </View>
                    :
                    <View></View>
                }

                {UrlQRCodeGoPay != '' ?
                    <View>
                        <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                            <Image source={{uri:UrlQRCodeGoPay}} style={{width:300, height:300}} resizeMode={'contain'} />
                        </View>

                        {/* Cara Pembayaran Gopay */}
                        <TouchableOpacity onPress={()=> setCaraPembayaranGoPay(!CaraPembayaranGoPay)} style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'#009dff', fontWeight:'bold'}}>Cara Pembayaran 
                            </Text>
                            <Icon type='ionicon'  name='list' color={'#009dff'} size={18} style={{marginLeft:10}} />
                        </TouchableOpacity>

                        {CaraPembayaranGoPay ? 
                        <View style={{marginTop:10}}>
                            <View>
                                <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>1. Buka aplikasi Gojek atau e-wallet lain Anda.</Text>
                                <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>2. Pindai kode QR pada monitor.</Text>
                                <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>3. Konfirmasi pembayaran pada aplikasi.</Text>
                                <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>4. Pembayaran selesai.</Text>
                            </View>
                        </View>
                        :
                        <View></View>  
                        }
                    </View>
                    :
                    <View></View>
                }

                {MetodePembayaran == 'Tunai'?
                    <View>
                        {!StatusTransaksi?
                            <TouchableOpacity onPress={()=>VerifikasiPembayaranTunai()} style={{borderRadius:10, width:'100%', paddingVertical:10, alignItems:'center', justifyContent:'center', backgroundColor:'green'}}>
                                <Text style={{fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold', color:'white'}}>Verifikasi Pembayaran</Text>
                            </TouchableOpacity>
                            :
                            <View></View>
                        }
                    </View>
                    :
                    <View></View>
                }
                {StatusTransaksi ?
                    <View style={{marginTop:10}}>
                        <TouchableOpacity onPress={()=>createPDF()} style={{borderRadius:10, width:'100%', paddingVertical:10, alignItems:'center', justifyContent:'center', backgroundColor:'green'}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold', color:'white'}}>Download Bukti Pemesanan</Text>
                        </TouchableOpacity>
                        <View style={{alignItems:'center', marginTop:10}}>
                            <QRCode
                                value={IDOrder+IDUser}
                                getRef={(c) => GetImageQR(c)}
                            />
                        </View>
                    </View>:
                    <View></View>
                }
            </View>
        )
    }

    return (
        <View style={{backgroundColor:'white', position:'relative', flex:1}}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={ModalTungguVerifikasi}
                onRequestClose={() => {
                    setModalTungguVerifikasi(!ModalTungguVerifikasi);
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
                                    color: 'green',
                                    fontSize: 14,
                                    fontFamily: 'Inter-Bold',
                                    marginTop:10,
                                    marginBottom:10,
                                    fontWeight:'bold'
                                }}>Tunggu Sebentar...</Text>
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
                    onPress={() => navigation.navigate('DaftarTransaksi')}>
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
                        }}>Detail Pesanan</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={{marginBottom:150, alignItems:'center', backgroundColor:'#F5F5F5', paddingVertical:10}}>
                {/* Metode Pembayaran */}
                <View style={{backgroundColor:'white', borderRadius:10, shadowColor: "#000",shadowOffset: {width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, justifyContent:'center', width:windowWidth-40, paddingVertical:20, paddingHorizontal:20, marginTop:5, marginBottom:10}}>
                    <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Nama : {NamaPenyewa}</Text>
                    <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>No HP : {NoHp}</Text>
                    <View style={{borderBottomColor:'black', borderBottomWidth:0.5, width:'100%', marginVertical:10}}></View>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Metode Pembayaran</Text>
                        </View>
                    </View>
                    {MetodePembayaran == 'BCA' ?
                        <View>
                            <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                                <Image source={BCAIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>BCA Virtual Account</Text>
                            </View>
                            {DetilPembayaran()}
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'Mandiri' ?
                        <View>
                            <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                                <Image source={MandiriIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>Mandiri Virtual Account</Text>
                            </View>
                            {DetilPembayaran()}
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'BNI' ?
                        <View>
                            <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                                <Image source={BNIIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>BNI Virtual Account</Text>
                            </View>
                            {DetilPembayaran()}
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'GoPay' ?
                        <View>
                            <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                                <Image source={GopayIcon} style={{width:80, height:40, marginRight:20}} resizeMode={'contain'} />
                            </View>
                            {DetilPembayaran()}
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'BRI' ?
                        <View>
                            <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                                <Image source={BRIIcon} style={{width:50, height:30, marginRight:20}} resizeMode={'contain'} />
                                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>BRI Virtual Account</Text>
                            </View>
                            {DetilPembayaran()}
                        </View>
                        :
                        <View></View>
                    }
                    {MetodePembayaran == 'Tunai' ?
                        <View>
                            <View style={{alignItems:'center', borderWidth:0.5, borderRadius:10, padding:5, marginTop:10, flexDirection:'row', justifyContent:'center'}}>
                                <Icon type={'ionicon'} name='wallet' size={25} color='green' style={{marginRight:20}}/>
                                <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, fontWeight:'bold'}}>Tunai</Text>
                            </View>
                            {DetilPembayaran()}
                        </View>
                        :
                        <View></View>
                    }
                </View>
                
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
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:16}}>{LamaSewa} hari</Text>
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
                        </View>
                        <View>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14, color:'red'}}>- {FormatRupiahGo(Diskon)}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <Text style={{color:'black', fontFamily:'Inter-Bold', fontSize:14}}>Ongkir</Text>
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
                
                {StatusTransaksi ?
                <View>
                    {StatusSewa == null ?
                    <View style={{backgroundColor:'white', borderRadius:10, shadowColor: "#000",shadowOffset: {width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, justifyContent:'center', width:windowWidth-40, paddingVertical:20, paddingHorizontal:20, marginTop:20}}>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>Anda dapat melakukan verifikasi pengembalian barang dengan menekan tombol di bawah ini.</Text>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', marginTop:10}}>Waktu pengembalian barang adalah:</Text>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>{TanggalPengembalian}</Text>
                        
                        <View style={{marginTop:10}}></View>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>Apakah pelanggan terlambat mengembalikan barang atau barang mengalami kerusakan?</Text>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>Masukkan jumlah denda di bawah ini</Text>
                        <View style={{borderWidth:1, borderColor:'grey', borderRadius:20, paddingLeft:10, marginTop:20, width:'100%'}}>
                            <TextInput
                                placeholder='Total Denda'
                                placeholderTextColor={'grey'}
                                value={TotalDenda}
                                onChangeText={TotalDenda => setTotalDenda(TotalDenda)}
                                style={{color:'black', fontFamily:'Inter-Regular', fontSize:12}}
                                keyboardType={'numeric'}
                                />
                        </View>

                        <TouchableOpacity onPress={()=>VerPengembalianBarang()} style={{borderRadius:10, backgroundColor:'green', paddingVertical:10, alignItems:'center', justifyContent:'center', marginTop:20}}>
                            <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'white', fontWeight:'bold'}}>Verifikasi Pengembalian Barang</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{backgroundColor:'white', borderRadius:10, shadowColor: "#000",shadowOffset: {width: 0, height: 2,},shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, justifyContent:'center', width:windowWidth-40, paddingVertical:20, paddingHorizontal:20, marginTop:20}}>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', fontWeight:'bold'}}>Barang telah dikembalikan.</Text>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', marginTop:10}}>Total Denda : {FormatRupiahGo(TotalDenda)}</Text>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black', marginTop:10}}>Tanggal Pengembalian</Text>
                        <Text style={{fontFamily:'Inter-Bold', fontSize:14, color:'black'}}>{TanggalSewa}</Text>
                    </View>
                    }
                </View>
                :
                <View></View>
                }
                <View style={{marginBottom:50}}></View>
            </ScrollView>
        </View>
    )
}

export default DetailPesanan
