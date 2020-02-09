import 'package:flutter/material.dart';

class LoginButton extends StatelessWidget {

  final Function loginPressed;
  final String buttonString;
  final Color buttonColor;
  LoginButton({this.loginPressed, this.buttonString, this.buttonColor});

  @override
  Widget build(BuildContext context) {
  return Padding(
      padding: EdgeInsets.symmetric(vertical: 16.0),
      child: RaisedButton(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        padding: EdgeInsets.all(12),
        onPressed: loginPressed,
        color: buttonColor,
        child: Text(
          buttonString,
          style: TextStyle(
            color: Colors.white,
            letterSpacing: 2.0,
          )
        ),
      ),
    );
}
}
