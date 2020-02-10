import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class LoadingPage extends StatefulWidget {

  @override
  _LoadingPageState createState() => _LoadingPageState();
}

class _LoadingPageState extends State<LoadingPage> {

  void loadApp() async {
    await new Future.delayed(const Duration(seconds : 2)); //E.g. Fetch userdata of logged in user
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  void initState() {
    super.initState();
    loadApp();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange[600],
      body: Center(
       child: SpinKitFadingGrid(color: Colors.white, size:50.0),
      ),
    );
  }
}
