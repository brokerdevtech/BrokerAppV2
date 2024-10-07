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
  // useEffect(() => {
  //     const fetchImage = async () => {
  //       try {

  //         const imageKey = 'IMG_20230925_063604.jpg'; // Replace with the key of your S3 object
  //         const params = {
  //           Bucket: 'broker2023',
  //           Key: imageKey,
  //         };

  //         s3.getObject(params, (error, data) => {
  //           if (error) {
  //             console.error('Error fetching image:', error);
  //             return;
  //           }
  //
  //           // Convert the S3 object data to a data URL for displaying the image
  //           const imageBuffer = data.Body;
  //           const base64Image = `data:image/jpeg;base64,${imageBuffer}`;
  //           setImageUrl(base64Image);
  //         });
  //       } catch (error) {
  //         console.error('Error fetching image:', error);
  //       }
  //     };

  //     fetchImage();
  //   }, []);

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
      } else {
        ImagePicker.launchImageLibrary(imagePickerOptions, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else {
            setSelectedFile(response);
          }
        });
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
    if (!selectedFile) {
      toast.show({
        title: 'Please select a file first',
      });
      return;
    }
    //
    //
    const responseBlob = await uriToBlob(selectedFile[0].uri);
    //
    //
    // const file = {
    //   uri: selectedFile.uri,
    //   name: 'my-image.jpg', // Set the desired file name in S3
    //   type: 'image/jpeg', // Set the MIME type for the image
    // };

    // const params = {
    //   Bucket: 'broker2023',
    //   Key: 'images/' + file.name, // The S3 path for the uploaded image
    //   Body: file,
    //   ACL: 'public-read', // Set the access level for the uploaded image
    // };
    const fileExtension = getFileExtensionFromMimeType(selectedFile[0].type);
    const docId = uuid.v4();
    const imageName = docId + '.' + fileExtension;
    const params = {
      Bucket: Bucket,
      Key: imageName, // The name/key of the file in S3
      Body: responseBlob, // The file content
    };
    try {
      setLoading(true);
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
    <View>
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
                  type="s16"
                  style={{...styles.ml15}}>
                  {truncateFileName(FileValueText)}
                </ZText>
              </>
            ) : (
              <ZText type="s16" style={styles.ml15}>
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
              <Icon
                as={File_tray_icon}
                // size={moderateScale(30)}
                color={color.black}
              />
            </Box>
            <Box>
              <ZText
                type="s16"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{...styles.ml15}}>
                {truncateFileName(selectedFile[0].name)}
              </ZText>
              {uploadFlag == false && (
                <ZText type="s16" style={styles.ml15} color={color.greenColor}>
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
