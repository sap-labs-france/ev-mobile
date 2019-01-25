package com.emobility;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.taluttasgiran.rnsecurestorage.RNSecureStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSecureStoragePackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RNSensitiveInfoPackage(),
            new ReactNativePushNotificationPackage(),
            new OrientationPackage(),
            new RNI18nPackage(),
            new RNGestureHandlerPackage(),
            new RNFirebasePackage(),
            new RNDeviceInfo(),
            new MPAndroidChartPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
