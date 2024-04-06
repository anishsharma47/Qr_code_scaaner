//import liraries
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Image,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import imagepath from './images/imagepath';
import ImagePicker from 'react-native-image-crop-picker';
import Clipboard from '@react-native-clipboard/clipboard';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const Home = () => {
  const [torchMode, setTouchMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [isUrl, setIsUrl] = useState(false);
  const [qrCodeActive, setQrCodeActive] = useState(true);


  function validateURL(url) {
    // Regular expression pattern for URL validation
    var urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\/[\w .-]*)*\/?$/i;
    // Test the URL against the pattern
    return urlPattern.test(url);
  }

  const copyToClipboard = text => {
    Clipboard.setString(text);
    alert('copied');
  };

  const onpenUrl = url => {
    Linking.openURL(url);
  };

  const openGallery = () => {

    Alert.alert("This is currently not working")

    return ;
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(res => {
      console.log('res', res.path);
    });
  };
  const first = useRef();

  const onSuccess = e => {
    if (!scannedData || scannedData == '') {
      setScannedData('please scan valid qr code');
    }
    setScannedData(e.data);
    setIsUrl(validateURL(`${e.data}`));
    setModalVisible(true);
    setTouchMode(false);
    setQrCodeActive(!qrCodeActive);
    console.log('qrcodeActive', qrCodeActive);
  };

  return (
    <>
    <View style={{flex:1}}>

      <View
        style={{
          padding:10,
          zIndex: 10000,
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          backgroundColor:'transparent',
          position:'absolute',
          top:0
        }}>
        <Image style={{width: 40, height: 40}} source={imagepath.qrCode} />
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            marginLeft: 10,
            textTransform: 'capitalize',
          }}>
          Scan your qr code here
        </Text>
      </View>
      <QRCodeScanner
        buttonPositive={'allow'}
        permissionDialogMessage="Allow camera permission"
        permissionDialogTitle="Permission"
        reactivate={qrCodeActive}
        ref={first}
        flashMode={
          torchMode
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off ||
              RNCamera.Constants.FlashMode.auto
        }
        markerStyle={styles.markerStyle}
        showMarker={true}
        cameraStyle={{width: '100%', height: windowHeight}}
        onRead={e => onSuccess(e)}
      />
      <View style={styles.bottomStyle}>
        <Pressable
          style={styles.touchAbleStyle}
          onPress={() => setTouchMode(!torchMode)}>
          <Image
            style={styles.imageStyle}
            source={torchMode ? imagepath.flashOn : imagepath.flashOff}
          />
        </Pressable>

        <Pressable style={styles.touchAbleStyle} onPress={() => openGallery()}>
          <Image style={styles.imageStyle} source={imagepath.icGallery} />
        </Pressable>
      </View>

      <Modal transparent={false} animationType="slide" visible={modalVisible}>
        <View style={styles.modalStyle}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              borderBottomWidth: 2,
              borderBottomColor: 'orange',
            }}>
            Result:
          </Text>
          <View style={{justifyContent: 'space-between', flex: 1}}>
            {!!isUrl ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  padding: 10,
                }}>
                <Text style={{color: 'black', flex: 0.8, fontSize: 18}}>
                  {scannedData}
                </Text>

                <Pressable
                  onPress={() => onpenUrl(scannedData)}
                  style={{flex: 0.2}}>
                  <Text style={{color: 'orange', textTransform: 'uppercase'}}>
                    Open url
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 20,
                  padding: 10,
                }}>
                <Text style={{color: 'black', fontSize: 18}}>
                  {scannedData}
                </Text>

                <Pressable
                  onPress={() => copyToClipboard(scannedData)}
                  style={{
                    backgroundColor: 'orange',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 6,
                    marginTop: 10,
                  }}>
                  <Image
                    style={{color: 'white', fontSize: 20, tintColor: 'white'}}
                    source={imagepath.icCopy}
                  />
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={() => {
                first.current.reactivate();
                setModalVisible(!modalVisible);
                setQrCodeActive(true);
              }}
              style={{
                backgroundColor: 'orange',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderRadius: 6,
              }}>
              <Text style={{color: 'white', fontSize: 20}}>Scan Again</Text>
            </Pressable>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Developer :</Text>
            <Text style={{color:'#8B8B8B',marginLeft:6,fontSize:14,fontWeight:'500'}}>Anish</Text>
            </View>
          </View>
        </View>
      </Modal>

      </View>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },

  textStyle: {
    marginLeft: 20,
    fontSize: 20,
  },
  markerStyle: {
    borderColor: 'green',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 3,
    justifyContent: 'center',
  },
  imageStyle: {
    width: 30,
    height: 30,
    objectFit: 'contain',
  },

  bottomStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },

  touchAbleStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
  },

  //modal style

  modalStyle: {
    backgroundColor: 'white',
    minHeight: windowHeight / 3,
    width: windowWidth,
    padding: 20,
    elevation: 2,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
});

//make this component available to the app
export default Home;
