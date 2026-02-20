// ignore_for_file: use_build_context_synchronously, avoid_print

import 'package:ayushmaanchain/service_provider/user_registry_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:provider/provider.dart';

class Signup extends StatefulWidget {
  const Signup({super.key});
  @override
  State<Signup> createState() => _SignupState();
}

class _SignupState extends State<Signup> {
  TextEditingController nameController = TextEditingController();
  String selectedRole = "pharmacist";
  String wallet_address = "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a";

  String backendLink = dotenv.env["BACKEND_LINK"] ?? "https://default-link.com";

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<UserRegistryProvider>(context, listen: false).init();
    });
  }

  Future<void> registerUser() async {
    final provider = Provider.of<UserRegistryProvider>(context, listen: false);

    if (!provider.initialized) {
      print("Service not initialized yet");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Initializing... please wait a moment.")),
      );
      return;
    }
    final userRegister = provider.service;

    try {
      print("Registering user with wallet address: $wallet_address");
      print("Selected role: $selectedRole");
      print("Name: ${nameController.text}");
      print("Backend link: $backendLink/register");

      final response = await http.post(
        Uri.parse("$backendLink/register"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "wallet_address": wallet_address,
          "name": nameController.text,
          "role": selectedRole,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        print("Registration successful: ${data['msg']}");
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Signup successful!")));
        await userRegister.registerUser(selectedRole); // role from dropdown
        print("Registered on chain");

        Navigator.pushReplacementNamed(context, '/login');
      } else {
        print("Signup failed: ${data['msg']}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? "Signup failed")),
        );
      }
    } catch (e) {
      print("Error during signup: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("An error occurred. Please try again.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    print("$backendLink/register");
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("AyushMaanChain"),
        backgroundColor: Colors.green,
        elevation: 0,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                selectedRole,
                style: TextStyle(fontSize: 20, color: Colors.black),
              ),
              TextField(
                controller: nameController,
                style: TextStyle(color: Colors.black),
                decoration: InputDecoration(
                  labelText: "Enter Your Name",
                  hintText: "Enter Your Name",
                  labelStyle: TextStyle(color: Colors.green),
                  hintStyle: TextStyle(color: Colors.grey),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.green, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.green, width: 2.5),
                  ),
                ),
              ),
              SizedBox(height: 20),
              DropdownButtonFormField<String>(
                style: TextStyle(color: Colors.black),
                dropdownColor: Colors.white,
                decoration: InputDecoration(
                  labelText: "Select Your Role",
                  labelStyle: TextStyle(color: Colors.green),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.green, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: Colors.green, width: 2.5),
                  ),
                ),
                value: selectedRole,
                items:
                    ["doctor", "patient", "pharmacist"].map((String role) {
                      return DropdownMenuItem<String>(
                        value: role,
                        child: Text(role),
                      );
                    }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    selectedRole = newValue!;
                  });
                },
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: registerUser,
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.green,
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    "Signup",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/login');
                },
                child: Text(
                  "Already have an account? Login",
                  style: TextStyle(color: Colors.green),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
