import 'package:ayushmaanchain/context/auth_provider.dart';
import 'package:barcode_scan2/barcode_scan2.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  String qrCodeResult = "";
  String role = "";

  Future<void> scanQRCode() async {
    print("---------------ROle: $role ----------");
    final result = await BarcodeScanner.scan();
    if (result.type == ResultType.Barcode) {
      setState(() {
        qrCodeResult = result.rawContent;
        if (role == "Pharmacist") {
          Navigator.pushNamed(
            context,
            "/verification",
            arguments: qrCodeResult,
          );
        }
        else if(role=="Patient"){
                 Navigator.pushNamed(
            context,
            "/verify-drug",
            arguments: qrCodeResult,  
          );
        }
      });
    } else if (result.type == ResultType.Error) {
      setState(() {
        qrCodeResult = "Error scanning QR";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userData = Provider.of<AuthProvider>(context);
  if (userData.role == "doctor") {
      role = "Doctor";
    } else if (userData.role == "patient") {
      role = "Patient";
    } else if (userData.role == "pharmacist") {
      role = "Pharmacist";
    } else {
      role = "Unknown";
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard"),
        centerTitle: true,
        backgroundColor: Colors.teal,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Card(
                elevation: 6,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      Text(
                        "Welcome, ${userData.name} 👋",
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ListTile(
                        leading: const Icon(Icons.account_balance_wallet),
                        title: const Text("Wallet Address"),
                        subtitle: Text(userData.walletAddress),
                      ),
                      ListTile(
                        leading: const Icon(Icons.verified_user),
                        title: const Text("Role"),
                        subtitle: Text(userData.role),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: scanQRCode,
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text("Scan QR Code"),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  textStyle: const TextStyle(fontSize: 16),
                  backgroundColor: Colors.teal,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),

              const SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/login');
                },
                child: const Text("Logout"),
              ),

            ],
          ),
        ),
      ),
    );
  }
}
