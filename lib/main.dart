import 'package:flutter/material.dart';
import 'package:flutter_observable/flutter_observable.dart';

import 'login_page.dart';
import 'home_page.dart';
import 'loading_page.dart';
import 'stores/auth.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PintFindr',
      theme: ThemeData(primarySwatch: Colors.orange, fontFamily: 'Nunito', hintColor: Colors.orange),
      home: LoadingPage(),
      /*ObservableBuilder(
        observable: auth.current,
        builder: (context, snapshot) => snapshot.data == null ? LoginPage() : HomePage(),
      ),*/
      routes: {
        '/login': (context) => LoginPage(),
        '/home': (context) => HomePage(),
      }
    );
  }
}
