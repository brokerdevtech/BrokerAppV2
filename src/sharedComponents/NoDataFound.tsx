import React from 'react';
import {useSelector} from 'react-redux';

import {styles} from '../themes';
import ZText from './ZText';

const NoDataFound: React.FC = () => {
  const colors = useSelector(state => state.theme.theme);
  return (
    <ZText
      type={'s18'}
      align={'center'}
      style={styles.pb20}
      color={colors.primary}>
      {`No record found`}
    </ZText>
  );
};

export default NoDataFound;
