// ignore_for_file: avoid_print
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:ayushmaanchain/service_provider/drug_nft_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:web3dart/crypto.dart';
import 'package:logger/logger.dart';

class VerifyDrug extends StatefulWidget {
  const VerifyDrug({super.key});

  @override
  State<VerifyDrug> createState() => _VerifyDrugState();
}

class _VerifyDrugState extends State<VerifyDrug> {
  String qrData = "";
  String tokenid = "";
  String stripid = "";
  final batchData = [];
  String backendUrl = dotenv.env["BACKEND_LINK"] ?? "https://default-link.com";

  bool? isValid;
  bool isvalidQr = true;
  bool isLoading = true;

  String expiryDate = "";
  String manufactureDate = "";
  String drugName = "";
  String manfCode = "";
  String description = "";

  var logger = Logger();
  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final provider = Provider.of<DrugNftProvider>(context, listen: false);
      await provider.init();
      final args = ModalRoute.of(context)!.settings.arguments;
      if (args != null) {
        qrData = args as String;
        await fetchData();
      }
    });
  }

  Future<void> fetchData() async {
    final provider = Provider.of<DrugNftProvider>(context, listen: false);

    if (!provider.initialized) {
      print("Service not initialized yet");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Initializing... please wait a moment.")),
      );
      return;
    }

    final drug = provider.service;
    print("-------------QRDTA $qrData-------------");

    final respons = await http.post(
      Uri.parse('$backendUrl/decryptQR'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"qrData": qrData}),
    );

    if (respons.statusCode == 400) {
      isvalidQr = false;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ Invalid or tampered QR code")),
      );
      setState(() {
        isvalidQr = false;
        isLoading = false;
      });
      return;
    }

    final dataa = jsonDecode(respons.body);

    final tokenId = BigInt.parse(dataa['tokenId'].trim());
    final stripId = dataa['stripId'].trim();

    print("-------------TOKEN ID $tokenId-------------");
    print("-------------STRIP ID $stripId-------------");
    // logger.i("Info log");
    // logger.d("Debug log");
    // logger.w("Warning log");
    // logger.e("Error log");
    // logger.t("Trace log");

    setState(() {
      tokenid = tokenId.toString();
      stripid = stripId;
    });

    final batchData = await drug.getBatch(tokenId);
    final ipfsURL = batchData[0][1].toString().replaceAll(
      "ipfs://",
      "https://ipfs.io/ipfs/",
    );

    final response = await http.post(
      Uri.parse('$backendUrl/get-merkle-proof'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"ipfsURL": ipfsURL, "stripID": stripId}),
    );

    final data = jsonDecode(response.body);
    final List<dynamic> proof = data['proof'];

    final result = await drug.verifyStrip(
      tokenId,
      stripId,
      proof.map((e) => hexToBytes(e.toString())).toList(),
    );

    setState(() {
      isValid = result;
      isLoading = false;
      isvalidQr = true;
      expiryDate = data['expiryDate'];
      manufactureDate = data['manufactureDate'];
      drugName = data['drugName'];
      manfCode = data['manfCode'];
      description = data['description'];
    });
  }

  Widget buildDrugInfo() {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Drug Details:",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text("🔹 Name: $drugName"),
            Text("🔹 Manufactured by: $manfCode"),
            Text("🔹 Description: $description"),
            Text("🔹 Manufacture Date: $manufactureDate"),
            Text("🔹 Expiry Date: $expiryDate"),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    qrData = ModalRoute.of(context)!.settings.arguments as String;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Verify Drug"),
        backgroundColor: Colors.teal,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child:
              isLoading
                  ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      CircularProgressIndicator(),
                      SizedBox(height: 20),
                      Text(
                        "Verifying medicine...",
                        style: TextStyle(fontSize: 18),
                      ),
                    ],
                  )
                  : SingleChildScrollView(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Verification Result",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 20),
                        if (!isvalidQr) ...[
                          Icon(Icons.warning, color: Colors.red, size: 80),
                          const SizedBox(height: 10),
                          const Text(
                            "Invalid Qr Code ❌",
                            style: TextStyle(
                              fontSize: 22,
                              color: Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ] else if (isValid == true && isvalidQr) ...[
                          Icon(Icons.verified, color: Colors.green, size: 80),
                          const SizedBox(height: 10),
                          const Text(
                            "Medicine is ORIGINAL ✅",
                            style: TextStyle(
                              fontSize: 22,
                              color: Colors.green,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          buildDrugInfo(),
                        ] else ...[
                          Icon(Icons.warning, color: Colors.red, size: 80),
                          const SizedBox(height: 10),
                          const Text(
                            "Counterfeit Medicine ❌",
                            style: TextStyle(
                              fontSize: 22,
                              color: Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          buildDrugInfo(),
                        ],
                        const SizedBox(height: 40),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                          ),
                          onPressed: () {
                            Navigator.pushNamed(context, '/home');
                          },
                          child: const Text(
                            "Go to Home",
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ],
                    ),
                  ),
        ),
      ),
    );
  }
}
