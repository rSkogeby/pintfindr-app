# Fixes Xcode AirMap error
sed -ie 's/RCTConvert\+MapKit\.m/RCTConvert\+AirMap\.m/g' node_modules/react-native-maps/lib/ios/AirMaps.xcodeproj/project.pbxproj
sed -ie 's/RCTConvert\+MapKit\.h/RCTConvert\+AirMap\.h/g' node_modules/react-native-maps/lib/ios/AirMaps.xcodeproj/project.pbxproj
rm -f node_modules/react-native-maps/.babelrc
