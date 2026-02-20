import 'package:ayushmaanchain/context/auth_provider.dart';
import 'package:ayushmaanchain/service_provider/prescription_nft_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Verification extends StatefulWidget {
  const Verification({Key? key}) : super(key: key);

  @override
  State<Verification> createState() => _VerificationState();
}

class _VerificationState extends State<Verification> {
  bool isVerified = false;
  bool isFulfilled = false;
  bool isExpired = false;
  bool isRevoked = false;
  String doctorAddress = "";
  String patientAddress = "";
  String doctorName = "";
  String patientName = "";
  String qrData = "";
  String prescription_uri = "";
  String backendUrl = dotenv.env["BACKEND_LINK"] ?? "https://default-link.com";

  @override
  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final provider = Provider.of<PrescriptionNftProvider>(
        context,
        listen: false,
      );
      await provider.init();
      final args = ModalRoute.of(context)!.settings.arguments;
      if (args != null) {
        qrData = args as String;
        await fetchData();
      }
    });
  }

  Future<String> fetchNameFromBackend(String walletAddress) async {
    print("Fetching name for address: $walletAddress");
    final response = await http.post(
      Uri.parse('$backendUrl/fetchData'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'walletAddress': walletAddress}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(response.body);
      return data['name'] ?? 'Unknown';
    } else {
      print(
        "Failed to fetch name for address $walletAddress: ${response.body}",
      );
      return 'Unknown';
    }
  }

  Future<void> fetchData() async {
    final provider = Provider.of<PrescriptionNftProvider>(
      context,
      listen: false,
    );

    if (!provider.initialized) {
      print("Service not initialized yet");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Initializing... please wait a moment.")),
      );
      return;
    }

    final prescription = provider.service;
    final tokenId = BigInt.from(int.parse(qrData));

    final verified = await prescription.isVerified(tokenId);
    final fulfilled = await prescription.isFulfilled(tokenId);
    final expired = await prescription.isExpired(tokenId);
    final revoked = await prescription.isRevoked(tokenId);
    final addresses = await prescription.getDoctorAndPatientByTokenId(tokenId);
    final doctor = addresses["doctor"] ?? "Unknown";
    final patient = addresses["patient"] ?? "Unknown";

    final uri = await prescription.tokenURI(tokenId); // Smart contract call
    print("Prescription URI: $uri");

    // ✅ Update state
    setState(() {
      isVerified = verified;
      prescription_uri = uri;
      isFulfilled = fulfilled;
      isExpired = expired;
      isRevoked = revoked;
      doctorAddress = doctor;
      patientAddress = patient;
    });
    final fetchedDoctorName = await fetchNameFromBackend(doctor);
    final fetchedPatientName = await fetchNameFromBackend(patient);

    setState(() {
      doctorName = fetchedDoctorName;
      patientName = fetchedPatientName;
    });
    print("Doctor Name: $doctorName");
    print("Patient Name: $patientName");

    // Debugging logs
    print("Doctor Address: $doctorAddress");
    print("Patient Address: $patientAddress");
    print("Is Verified: $isVerified");
    print("Is Fulfilled: $isFulfilled");
    print("Is Expired: $isExpired");
    print("Is Revoked: $isRevoked");
    print("Token ID: $tokenId");
    print("QR Data: $qrData");
  }

  Future<void> markFullfilled() async {
    final provider = Provider.of<PrescriptionNftProvider>(
      context,
      listen: false,
    );
    if (!provider.initialized) {
      print("Service not initialized yet");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Initializing... please wait a moment.")),
      );
      return;
    }
    final prescription = provider.service;
    final tokenId = BigInt.from(int.parse(qrData));
    await prescription.fulfillPrescription(tokenId);

    setState(() {
      isFulfilled = true;
    });
  }

  Future<void> openPrescription() async {
    Navigator.pushNamed(context, "/view_pdf", arguments: prescription_uri);
  }

  @override
  Widget build(BuildContext context) {
    qrData = ModalRoute.of(context)!.settings.arguments as String;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Prescription Verification"),
        backgroundColor: Colors.teal,
        centerTitle: true,
      ),
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),

          child: Card(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            color: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    "Prescription Verification",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    "Token Id: $qrData",
                    style: const TextStyle(fontSize: 16),
                  ),
                  const Divider(height: 30),

                  // Doctor & Patient Info
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Doctor Name: - $doctorName",
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Patient Name: -$patientName",
                        style: const TextStyle(fontSize: 16),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Status Chips
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Status:",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Chip(
                        label: Text(
                          isRevoked
                              ? "Revoked ❌"
                              : isExpired
                              ? "Expired ⚠️"
                              : isVerified
                              ? "Verified ✅"
                              : "Not Verified",
                          style: const TextStyle(fontWeight: FontWeight.w500),
                        ),
                        backgroundColor:
                            isRevoked
                                ? Colors.red[100]
                                : isExpired
                                ? Colors.yellow[100]
                                : isVerified
                                ? Colors.green[100]
                                : Colors.grey[300],
                        labelStyle: TextStyle(
                          color:
                              isRevoked
                                  ? Colors.red[700]
                                  : isExpired
                                  ? Colors.yellow[800]
                                  : isVerified
                                  ? Colors.green[800]
                                  : Colors.grey[700],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  if (isVerified && !isRevoked && !isExpired)
                    const Text(
                      "✅ This prescription is valid.",
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.w600,
                      ),
                    )
                  else
                    const Text(
                      "⚠️ This prescription is NOT valid.",
                      style: TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.w600,
                      ),
                    ),

                  if (isFulfilled)
                    const Padding(
                      padding: EdgeInsets.only(top: 8.0),
                      child: Text(
                        "✅ Already Dispensed",
                        style: TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),

                  const SizedBox(height: 20),

                  // Action Buttons
                  if (isVerified && !isRevoked && !isExpired && !isFulfilled)
                    Column(
                      children: [
                        ElevatedButton(
                          onPressed: openPrescription,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            minimumSize: const Size(double.infinity, 50),
                          ),
                          child: const Text("View Prescription"),
                        ),
                        const SizedBox(height: 10),
                        ElevatedButton(
                          onPressed: markFullfilled,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            minimumSize: const Size(double.infinity, 50),
                          ),
                          child: const Text("Mark as Dispensed"),
                        ),
                      ],
                    ),

                  // Fetch Button
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
