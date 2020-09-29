import { NavigationContainerRef } from '@react-navigation/native';
import React from 'react';

export default interface BaseProps {
  navigation: NavigationContainerRef;
  route?: any;
  children?: React.ReactNode;
  key?: string;
}
