package com.wylldo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.oblador.vectoricons.VectorIconsPackage;

import com.imagepicker.ImagePickerPackage;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.airbnb.android.react.maps.MapsPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
      
      @Override
      protected ReactGateway createReactGateway() {
          ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
              @Override
              protected String getJSMainModuleName() {
                  return "index";
              }
          };
          return new ReactGateway(this, isDebug(), host);
      }
  
      @Override
      public boolean isDebug() {
          return BuildConfig.DEBUG;
      }
  
      protected List<ReactPackage> getPackages() {
          // Add additional packages you require here
          // No need to add RnnPackage and MainReactPackage
          return Arrays.<ReactPackage>asList(
              // eg. new VectorIconsPackage()
              new MainReactPackage(),
              new ImageResizerPackage(),
              new RNFirebasePackage(),
              new MapsPackage(),
              new VectorIconsPackage(),
              new ImagePickerPackage(),
              new RNFirebaseFirestorePackage(),
              new RNFirebaseStoragePackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseFunctionsPackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage()

          );
      }
    
      @Override
      public List<ReactPackage> createAdditionalReactPackages() {
          return getPackages();
      }
  }