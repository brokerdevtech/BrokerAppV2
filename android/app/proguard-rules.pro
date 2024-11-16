# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Keep Fresco AnimatedCache and related classes
-keep class com.facebook.imagepipeline.cache.AnimatedCache { *; }
-keep class com.facebook.imagepipeline.cache.AnimationFrames { *; }
-keep class com.facebook.imagepipeline.nativecode.WebpTranscoder { *; }

# Keep Fresco Animation and Native Code Support
-keep class com.facebook.fresco.** { *; }
-dontwarn com.facebook.fresco.**
-dontwarn com.facebook.imagepipeline.**