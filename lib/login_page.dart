import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'stores/auth.dart';
import 'login_button.dart';

class LoginPage extends StatefulWidget {
  static String tag = 'login-page';
  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  var loading = false;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final banner = Hero(
      tag: 'hero',
      child: CircleAvatar(
        backgroundColor: Colors.transparent,
        radius: 98.0,
        child: Image.asset('assets/logo_title_slogan.png'),
      ),
    );

    if (this.loading) {
      return Scaffold(
        backgroundColor: Colors.black,
        body: Center(
          child: ListView(
            shrinkWrap: true,
            padding: EdgeInsets.only(left: 24.0, right: 24.0),
            children: <Widget>[banner, SizedBox(height: 88.0), CupertinoActivityIndicator()],
          ),
        ),
      );
    }

    final logo = Hero(
      tag: 'hero',
      child: Center(
        child: new Container(
            width: 150.0,
            height: 150.0,
            decoration: new BoxDecoration(
                shape: BoxShape.circle,
                image: new DecorationImage(
                    fit: BoxFit.cover,
                    image: new AssetImage(
                        "assets/icon.png")
                ),
              ),
            ),
        ),
    );


    final email = TextFormField(
      keyboardType: TextInputType.emailAddress,
      autofocus: false,
      controller: this.emailController,
      style: TextStyle(
        color: Colors.white,
      ),
      decoration: InputDecoration(
        hintText: 'Email',
        contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(32.0)),
      ),
    );

    final password = TextFormField(
      autofocus: false,
      controller: this.passwordController,
      obscureText: true,
      style: TextStyle(
        color: Colors.white,
      ),
      decoration: InputDecoration(
        hintText: 'Password',
        contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(32.0)),
      ),
    );

    final loginButton = LoginButton(
      loginPressed: () async {
          setState(() => this.loading = true);
          try {
            await auth.login(this.emailController.text, this.passwordController.text);
          } catch (_) {
            showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(title: new Text('Failed to log in'));
                });
          }

          if (mounted) setState(() => this.loading = false);
        },
      buttonColor: Colors.orangeAccent,
      buttonString: 'Log In',
    );
    final forgotLabel = FlatButton(
      child: Text(
        'Forgot password?',
        style: TextStyle(
          color: Colors.black,
          letterSpacing: 2.0,
        ),
      ),
      onPressed: () {},
    );

    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ListView(
          shrinkWrap: true,
          padding: EdgeInsets.only(left: 24.0, right: 24.0),
          children: <Widget>[
            logo,
            SizedBox(height: 48.0),
            email,
            SizedBox(height: 8.0),
            password,
            SizedBox(height: 24.0),
            loginButton,
            forgotLabel,
          ],
        ),
      ),
    );
  }
}
