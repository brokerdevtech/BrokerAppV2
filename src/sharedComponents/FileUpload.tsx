/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import ZText from './ZText';
import {useSelector} from 'react-redux';
import {useS3} from '../Context/S3Context';
import {getFileExtensionFromMimeType, uriToBlob} from '../utils/helpers';
import {HStack} from '../../components/ui/hstack';
import {Box} from '../../components/ui/box';
import {moderateScale} from '../config/constants';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {styles} from '../themes';
import DocumentPicker from 'react-native-document-picker';
import {useToast} from '../../components/ui/toast';
import {
  CloseIcon,
  Document_text,
  File_tray_icon,
  Upload_Icon,
} from '../assets/svg';
import {Icon} from '../../components/ui/icon';
import {Color} from '../styles/GlobalStyles';
import uuid from 'react-native-uuid';
const FileUpload = ({
  DisplayText,
  OnUpload,
  setLoading,
  islocked = false,
  FileValue = '',
  FileValueText = '',
  Bucket = 'broker2023',
}) => {
  const s3 = useS3();
  const color = useSelector(state => state.theme.theme);
  const [selectedFile, setSelectedFile] = useState(null);
  const [clearFlag, setclearFlag] = useState(true);
  const [uploadFlag, setuploadFlag] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState(null);
  const imageUrl1 =
    'https://broker2023.s3.ap-south-1.amazonaws.com/8af015ae-77e2-4f0d-bccf-6a5ea041b131.jpg';
  const MAX_DISPLAY_LENGTH = 22; // Define the maximum display length

  // Function to truncate the file name
  const truncateFileName = fileName => {
    if (fileName.length > MAX_DISPLAY_LENGTH) {
      return fileName.substring(0, MAX_DISPLAY_LENGTH) + '...';
    }
    return fileName;
  };

  const pickFile = async () => {
    try {
      const imagePickerOptions = {
        title: 'Select File',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      const documentPickerResult = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setclearFlag(true);
      setuploadFlag(true);
      if (documentPickerResult) {
        setSelectedFile(documentPickerResult);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
      } else {
        // Handle other errors
        console.error(err);
      }
    }
  };

  const uploadFile = async () => {
    // console.log('upload');
    if (!selectedFile) {
      toast.show({
        title: 'Please select a file first',
      });
      return;
    }

    const responseBlob = await uriToBlob(selectedFile[0].uri);

    const fileExtension = getFileExtensionFromMimeType(selectedFile[0].type);
    console.log(fileExtension, 'res');
    const docId = uuid.v4();
    const imageName = docId + '.' + fileExtension;
    const params = {
      Bucket: Bucket,
      Key: imageName,
      Body: responseBlob,
    };

    try {
      let result = await s3.upload(params).promise();

      OnUpload(result.key);
      setclearFlag(false);
      setuploadFlag(false);

      // Alert('Upload Success', 'Image uploaded to S3 successfully.');
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image to S3:', error);
      // Alert.alert('Upload Error', 'An error occurred while uploading the image to S3.');
    }
  };
  const clearFile = () => {
    setSelectedFile(null);
  };
  return (
    <View
      style={{
        marginBottom: 20,
        borderColor: Color.borderColor,
        borderBottomWidth: 1,
        paddingVertical: 10,
      }}>
      {!selectedFile && (
        <HStack space={2}>
          <Box>
            <Icon
              as={File_tray_icon}
              // size={moderateScale(30)}
              color={color.black}
            />
          </Box>
          <Box width={'70%'}>
            {FileValue !== '' ? (
              <>
                <ZText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  type="R16"
                  style={{...styles.ml15}}>
                  {truncateFileName(FileValueText)}
                </ZText>
              </>
            ) : (
              <ZText type="R16" style={styles.ml15}>
                {DisplayText}
              </ZText>
            )}
          </Box>
          {FileValue == '' && islocked == true && (
            <TouchableOpacity style={localStyles.lastitem} onPress={pickFile}>
              <Icon as={Document_text} color={color.greenColor} />
            </TouchableOpacity>
          )}

          {islocked == false && (
            <TouchableOpacity style={localStyles.lastitem} onPress={pickFile}>
              <Icon as={Document_text} color={color.greenColor} />
            </TouchableOpacity>
          )}
        </HStack>

        // <Button onPress={pickFile}>
        //   <Text>Select File</Text>
        // </Button>
      )}
      {selectedFile && (
        <>
          <HStack space={3}>
            <Box>
              <Icon as={File_tray_icon} color={color.black} />
            </Box>
            <Box>
              <ZText
                type="R16"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{...styles.ml15}}>
                {truncateFileName(selectedFile[0].name)}
              </ZText>
              {uploadFlag == false && (
                <ZText type="R16" style={styles.ml15} color={color.greenColor}>
                  {`Document uploaded`}
                </ZText>
              )}
            </Box>
            <Box style={localStyles.lastitem}>
              {clearFlag && (
                <Box style={{marginHorizontal: 5}}>
                  <Icon
                    as={CloseIcon}
                    // size={moderateScale(30)}
                    onPress={clearFile}
                    color={'red'}
                  />
                </Box>
              )}
              {uploadFlag && (
                <TouchableOpacity onPress={uploadFile}>
                  <Icon as={Upload_Icon} color={color.primary} />
                </TouchableOpacity>
              )}
            </Box>
            {uploadFlag == false && clearFlag == false && (
              <Box style={localStyles.lastitem}>
                <Icon as={Document_text} color={color.greenColor} />
              </Box>
            )}
          </HStack>
        </>
      )}
    </View>
  );
};
const localStyles = StyleSheet.create({
  lastitem: {
    marginLeft: 'auto',
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  settingsContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mb20,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.rowEnd,
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  listicons: {
    width: '10%',
  },
});
export default FileUpload;
