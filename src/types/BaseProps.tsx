import {NavigationContainerRef, RouteProp} from '@react-navigation/native';
import React from 'react';

export default interface  BaseProps {
  navigation: NavigationContainerRef<ReactNavigation.RootParamList>;
  route?: RouteProp<any>;
  children?: React.ReactNode;
  key?: string;
}
