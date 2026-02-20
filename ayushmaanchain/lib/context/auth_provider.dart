// ignore_for_file: prefer_final_fields

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  bool get isLoggedIn => _isLoggedIn;
  String _walletAddress = "";
  String get walletAddress => _walletAddress;
  String _role = "";
  String get role => _role;
  String _name = "";
  String get name => _name;

  AuthProvider() {
    _loadLoginStatus();
  }
  void _loadLoginStatus() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _isLoggedIn = prefs.getBool('loggedIn') ?? false;
    _name = prefs.getString('username') ?? '';
    _walletAddress = prefs.getString('walletAddress') ?? '';
    _role = prefs.getString('role') ?? '';
    notifyListeners();
  }

  Future<void> login(String name, String role, String walletAddress) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _name = name;
    _role = role;
    _walletAddress = walletAddress;
    await prefs.setString('walletAddress', walletAddress);
    await prefs.setBool('loggedIn', true);
    await prefs.setString('username', name);
    await prefs.setString('role', role);
    _isLoggedIn = true;
    notifyListeners();
  }

  Future<void> logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('loggedIn', false);
    await prefs.remove('username');
    await prefs.remove('walletAddress');
    await prefs.remove('role');

    _name = '';
    _role = '';
    _walletAddress = '';
    _isLoggedIn = false;
    notifyListeners();
  }
}
