package com.emobility;

import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

   @Override
   public void onConfigurationChanged(Configuration newConfig) {
       super.onConfigurationChanged(newConfig);
       Intent intent = new Intent("onConfigurationChanged");
       intent.putExtra("newConfig", newConfig);
       this.sendBroadcast(intent);
   }

   @Override
    protected void onCreate(Bundle savedInstanceState) {
       RNBootSplash.init(this);
       super.onCreate(null);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "eMobility";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
      };
    }
}
