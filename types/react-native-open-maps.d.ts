declare module 'react-native-open-maps' {
    export default function openMap(params: {
      latitude: number;
      longitude: number;
      zoom: number;
    }): void;
  }
  