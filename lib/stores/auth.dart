import 'dart:convert';

import 'package:flutter_observable/flutter_observable.dart';
import 'package:http/http.dart' as http;

import '../config.dart';

class Authentication {
  final String email;
  final String handle;
  final String token;

  Authentication({this.email, this.handle, this.token});
}

class _AuthStore {
  final _current = ObservableController<Authentication>(null);
  Observable<Authentication> get current => _current.observable;

  Future<void> login(String email, String password) async {
    var body = jsonEncode({'email': email, 'password': password});
    var headers = {'Content-Type': 'application/json'};

    final response = await http.post('$API_HOST/session', headers: headers, body: body);

    if (response.statusCode == 200) {
      final body = json.decode(response.body);
      _current.value = Authentication(email: email, handle: body['handle'], token: body['token']);
    } else {
      throw Exception('Failed to login');
    }
  }
}

final auth = _AuthStore();
