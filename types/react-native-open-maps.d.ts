declare module 'react-native-open-maps' {
  export default function openMap(params: {
    latitude: number;
    longitude: number;
    zoom: number;
    provider?: "google"|"apple";
    query?: string;
    travelType?: "drive"|"walk"|"public_transport",
    start?: string;
    end?: string;
  }): void;
}
