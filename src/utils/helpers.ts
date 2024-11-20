import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {PermissionKey} from '../config/constants';
import RNFS from 'react-native-fs';
// Check App Platform
const checkPlatform = () => {
  if (Platform.OS === 'android') {
    return 'android';
  } else {
    return 'ios';
  }
};

// Device Type
const getDeviceType = () => {
  if (checkPlatform() === 'ios') {
    return 2;
  } else {
    return 1;
  }
};

// Set Async Storage Data
const setAsyncStorageData = async (key, value) => {
  const stringData = JSON.stringify(value);
  await AsyncStorage.setItem(key, stringData);
};

// Get Async Storage Data
const getAsyncStorageData = async key => {
  const data = await AsyncStorage.getItem(key);
  return JSON.parse(data);
};

// Debounce
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function secondsToMilliseconds(seconds) {
  return seconds * 1000;
}
function getFileExtensionFromMimeType(mimeType) {
  // Split the MIME type by '/'
  const parts = mimeType.split('/');
  if (parts.length === 2) {
    // The file extension is the second part
    return parts[1];
  } else {
    // If the MIME type doesn't have two parts, return null or handle it as needed
    return null;
  }
}

function getList(data) {
  const selected = data.filter(p => p.isSelected === 1);

  if (selected.length === 0) {
    return [];
  }

  return selected.map(({isSelected, ...rest}) => rest);
}
function updateNestedObject(
  obj,
  updates,
  deletions = [],
  visited = new WeakSet(),
) {
  if (typeof obj !== 'object' || obj === null || visited.has(obj)) {
    // If the object is not an object, is null, or has been visited, return it as is
    return obj;
  }

  if (Array.isArray(obj)) {
    // If the object is an array, recursively update elements within the array
    return obj.map(item =>
      updateNestedObject(item, updates, deletions, visited),
    );
  }

  // If the object is an object, mark it as visited
  visited.add(obj);

  // Create a copy of the object
  const updatedObj = {...obj};

  // Delete specified properties
  for (const key of deletions) {
    delete updatedObj[key];
  }

  // Update or add properties
  for (const key in updates) {
    if (key in updatedObj) {
      updatedObj[key] = updates[key];
    }
  }

  // Recursively update nested properties, excluding "industry"
  for (const key in updatedObj) {
    if (key !== 'industry') {
      updatedObj[key] = updateNestedObject(
        updatedObj[key],
        updates,
        deletions,
        visited,
      );
    }
  }

  return updatedObj;
}
function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // If successful -> return with blob
    xhr.onload = function () {
      resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };

    // Set the response type to 'blob' - this means the server's response
    // will be accessed as a binary object
    xhr.responseType = 'blob';

    // Initialize the request. The third argument set to 'true' denotes
    // that the request is asynchronous
    xhr.open('GET', uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
  });
}
function uriToBlobRFNS(uri) {
  return new Promise((resolve, reject) => {
    RNFS.readFile(uri, 'base64')
      .then(data => {
        const blob = new Blob([Buffer.from(data, 'base64')], {
          type: 'application/octet-stream',
        });
        resolve(blob);
      })
      .catch(err => {
        reject(err);
      });
  });
}
function formatNumberToIndianSystem(number) {
  if (number === 0) {
    return '0'; // Explicitly handle zero
  }
  if (number) {
    if (number >= 10000000) {
      // Convert to Crores (1 Cr = 10,000,000)
      return (number / 10000000).toFixed(2) + ' Cr';
    } else if (number >= 100000) {
      // Convert to Lakhs (1 Lac = 100,000)
      return (number / 100000).toFixed(1) + ' Lac';
    } else if (number >= 1000) {
      // Convert to Thousands (1 K = 1,000)
      return (number / 1000).toFixed(1) + ' K';
    } else {
      // Use the number as it is
      return number.toString();
    }
  } else {
    return '';
  }
}
function checkPermission(
  permissionsArray: {permissionUID: number; permissionKey: string}[],
  permissionEnum: PermissionKey,
): boolean {
  const permissionKey = PermissionKey[permissionEnum];
  return permissionsArray?.some(
    permission => permission.permissionKey === permissionKey,
  );
}
export {
  getAsyncStorageData,
  setAsyncStorageData,
  getDeviceType,
  checkPlatform,
  debounce,
  secondsToMilliseconds,
  getFileExtensionFromMimeType,
  updateNestedObject,
  getList,
  uriToBlob,
  formatNumberToIndianSystem,
  checkPermission,
  uriToBlobRFNS,
};
