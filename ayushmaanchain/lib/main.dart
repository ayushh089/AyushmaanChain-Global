import 'package:ayushmaanchain/service_provider/drug_nft_provider.dart';
import 'package:ayushmaanchain/service_provider/prescription_nft_provider.dart';
import 'package:ayushmaanchain/service_provider/user_registry_provider.dart';
import 'package:ayushmaanchain/verify_prescription.dart';
import 'package:ayushmaanchain/verify_drug.dart';

import 'package:ayushmaanchain/view_pdf.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'context/auth_provider.dart';
import 'login.dart';
import 'signup.dart';
import 'home.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserRegistryProvider()..init()),
        ChangeNotifierProvider(
          create: (_) => PrescriptionNftProvider()..init(),
        ),
        ChangeNotifierProvider(create: (_) => DrugNftProvider()..init()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return authProvider.isLoggedIn ? const Home() : const Signup();
        },
      ),
      // initialRoute: '/home',
      routes: {
        '/signup': (context) => const Signup(),
        '/home': (context) => const Home(),
        '/login': (context) => const Login(),
        '/verification': (context) => const Verification(),
        '/view_pdf': (context) => ViewPdf(),
        '/verify-drug': (context) => VerifyDrug(),
      },
    );
  }
}
