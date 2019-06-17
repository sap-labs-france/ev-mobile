// flow-typed signature: 10cc5bc2122bf4854ee30d712ae9329e
// flow-typed version: c72bfb2ba6/react-native-orientation_v3.x.x/flow_>=v0.68.0

declare module "react-native-orientation" {
  declare export type Orientations =
    | "LANDSCAPE"
    | "PORTRAIT"
    | "PORTRAITUPSIDEDOWN"
    | "UNKNOWN";

  declare export type SpecificOrientations =
    | "LANDSCAPE-LEFT"
    | "LANDSCAPE-RIGHT"
    | "PORTRAIT"
    | "PORTRAITUPSIDEDOWN"
    | "UNKNOWN";

  declare module.exports: {
    getInitialOrientation(): ?Orientations,
    getOrientation((error: ?Error, payload?: Orientations) => void): void,
    getSpecificOrientation(
      (error: ?Error, payload?: SpecificOrientations) => void
    ): void,
    lockToPortrait(): void,
    lockToLandscape(): void,
    lockToLandscapeRight(): void,
    lockToLandscapeLeft(): void,
    unlockAllOrientations(): void,
    addOrientationListener((payload?: Orientations) => void): void,
    removeOrientationListener((payload?: Orientations) => void): void,
    addSpecificOrientationListener(
      (payload?: SpecificOrientations) => void
    ): void,
    removeSpecificOrientationListener(
      (payload?: SpecificOrientations) => void
    ): void
  };
}
