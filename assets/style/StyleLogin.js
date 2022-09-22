import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    Container: {
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TitleLogin:{
        fontWeight:'bold',
        color:'black', 
        fontSize:24,
        fontFamily:'arial', 
        marginBottom:20
    },
    TextTitleLogin: {
        fontFamily: 'arial',
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 50,
        marginBottom: 10
    },
    FormField: {
        height: 40,
        borderWidth: 1,
        marginTop: 10,
        color: 'black',
        borderRadius: 10,
        paddingLeft: 30,
        width: 300,
        fontSize: 12
    },
    IconField:{
        position:'absolute',
        top:23,
        left:7
    },  
    CekPassword: {
        position: 'absolute',
        right: 10,
        top: 22
    },
    TextLupaPassword:{
        fontFamily:'arial',
        fontSize:12,
        color:'black',
        textAlign:'right',
        textDecorationLine:'underline'
    },
    BoxLupaPassword:{
        width:300,
        paddingRight:5,
        marginTop:5
    },
    ContainerLupaPassword:{
        width:'100%',
        alignItems:'center'
    },
    ContainerBtn:{
        flexDirection:'row',
        marginTop:30,
        marginBottom:30,
        marginHorizontal:30
    },
    TextBtnMasuk:{
        fontFamily:'arial',
        fontSize:12,
        color:'white',
        fontWeight:'bold'
    },
    TextBtnDaftar:{
        fontFamily:'arial',
        fontSize:12,
        color:'black',
        fontWeight:'bold'
    },
    BoxBtnMasuk:{
        flex:1,
        height:36,
        backgroundColor:'#009B4D',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
    },
    BoxBtnDaftar:{
        width:140,
        height:36,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        borderWidth:1,
    },
    ContainerBtnSosmed:{
        flexDirection:'row',
        marginTop:10,
        marginBottom:30,
    },
    LogoSosmed:{
        width:40,
        height:40,
        marginHorizontal:10
    }
})