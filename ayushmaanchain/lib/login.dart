import 'dart:convert';
import 'dart:typed_data';

import 'package:ayushmaanchain/context/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web3dart/web3dart.dart';
import 'package:web3dart/crypto.dart'; // for bytesToHex

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  TextEditingController walletController = TextEditingController();
  TextEditingController privateKeyController = TextEditingController();

  bool loading = false;
  String challenge = "";
  String signature = "";

  String backendUrl = dotenv.env["BACKEND_LINK"] ?? "https://default-link.com";

  Future<void> getChallenge() async {
    if (walletController.text.isEmpty) return;

    setState(() => loading = true);
    try {
      final response = await http.get(
        Uri.parse(
          '$backendUrl/challenge?walletAddress=${walletController.text.trim()}',
        ),
      );

      if (response.statusCode == 200) {
        setState(() {
          challenge = jsonDecode(response.body)['challenge'];
        });
      } else {
        _showSnackbar("Failed to fetch challenge message.");
      }
    } catch (e) {
      _showSnackbar("Error fetching challenge: $e");
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> signChallenge() async {
    if (privateKeyController.text.isEmpty || challenge.isEmpty) {
      _showSnackbar("Please fetch the challenge and enter your private key.");
      return;
    }

    try {
      final wallet = EthPrivateKey.fromHex(privateKeyController.text.trim());
      final Uint8List challengeBytes = Uint8List.fromList(challenge.codeUnits);
      final sig = await wallet.signPersonalMessage(challengeBytes);

      setState(() {
        signature = bytesToHex(sig, include0x: true);
      });
    } catch (e) {
      _showSnackbar("Signing failed: $e");
    }
  }

  Future<void> login() async {
    if (walletController.text.isEmpty ||
        challenge.isEmpty ||
        signature.isEmpty) {
      _showSnackbar("Missing data. Complete all steps.");
      return;
    }

    setState(() => loading = true);
    try {
      final response = await http.post(
        Uri.parse('$backendUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "walletAddress": walletController.text.trim(),
          "challengeMessage": challenge,
          "signature": signature,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final profile = data['profile']['rows'][0];
        print("Profile: $profile");
        print("Profile: ${profile['name']}");
        print("Profile: ${profile['role']}");
        print("Profile: ${profile['wallet_address']}");
        print("Profile: ${profile['wallet_address']}");
        Provider.of<AuthProvider>(
          context,
          listen: false,
        ).login(profile['name'], profile['role'], profile['wallet_address']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('loggedIn', true);
        await prefs.setString('user', jsonEncode(profile));

        Navigator.pushReplacementNamed(context, '/home');
      } else {
        _showSnackbar("Login failed.");
      }
    } catch (e) {
      _showSnackbar("Login error: $e");
    } finally {
      setState(() => loading = false);
    }
  }

  void _showSnackbar(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0FFF4),
      appBar: AppBar(
        backgroundColor: Colors.green.shade700,
        title: const Text("Login", style: TextStyle(color: Colors.white)),
        centerTitle: true,
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.shade100,
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  "Login with Wallet",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: walletController,
                  decoration: InputDecoration(
                    labelText: "Wallet Address",
                    border: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                        color: Colors.green.shade700,
                        width: 2,
                      ),
                    ),
                    prefixIcon: Icon(
                      Icons.account_balance_wallet,
                      color: Colors.green.shade700,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: privateKeyController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: "Private Key",
                    border: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                        color: Colors.green.shade700,
                        width: 2,
                      ),
                    ),
                    prefixIcon: Icon(Icons.lock, color: Colors.green.shade700),
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: loading ? null : getChallenge,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    "Get Challenge Message",
                    style: TextStyle(fontSize: 16),
                  ),
                ),
                const SizedBox(height: 12),
                if (challenge.isNotEmpty && signature.isEmpty)
                  ElevatedButton(
                    onPressed: loading ? null : signChallenge,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade600,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "Sign Challenge",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                if (signature.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: loading ? null : login,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade800,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text("Login", style: TextStyle(fontSize: 16)),
                  ),
                  
                ],
                              const SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/signup');
                },
                child: const Text("Not a user ? SignUp"),
              ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
