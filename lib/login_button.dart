import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class LoginButton extends StatelessWidget {

  final Function loginPressed;
  final String buttonString;
  final Color buttonColor;
  final IconData buttonIcon;
  final Color iconColor;
  LoginButton({
    this.loginPressed,
    this.buttonString,
    this.buttonColor,
    this.buttonIcon,
    this.iconColor
  });

  @override
  Widget build(BuildContext context) {
  return Padding(
      padding: EdgeInsets.symmetric(vertical: 0.0),
      child: RaisedButton(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        padding: EdgeInsets.all(12),
        onPressed: loginPressed,
        color: buttonColor,
        child: Row( // Replace with a Row for horizontal icon + text
                  children: <Widget>[
                    Icon(
                      buttonIcon,
                      color: iconColor),
                    SizedBox(width: 12.0),
                    Center (child: Text(
                      buttonString,
                      style: TextStyle(
                        color: Colors.white,
                        letterSpacing: 2.0,
                      )
                    )),
                  ],
                ),
      ),
    );
}
}
