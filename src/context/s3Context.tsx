import React, {createContext, useContext, useState, useEffect} from 'react';
import AWS from 'aws-sdk';

// Create an S3 context
const S3Context = createContext();

// Create a custom S3 provider component
export const S3Provider = ({children}) => {
  const [s3Instance, setS3Instance] = useState(null);

  useEffect(() => {
    // Initialize the AWS SDK with your credentials and region
    AWS.config.update({
      accessKeyId: 'AKIAWRSHOUD5ZTGQ24MZ',
      secretAccessKey: 'cQwZf4aMvgqiFsA1ZFfYewQOzTInDTLQDitMQE/U',
      region: 'ap-south-1',
    });

    // Create an S3 instance
    const s3 = new AWS.S3();

    // Set the S3 instance in the context
    setS3Instance(s3);
  }, []);

  return <S3Context.Provider value={s3Instance}>{children}</S3Context.Provider>;
};

// Create a custom hook to access the S3 instance from components
export const useS3 = () => {
  const s3Instance = useContext(S3Context);
  if (!s3Instance) {
    throw new Error('useS3 must be used within an S3Provider');
  }
  return s3Instance;
};
