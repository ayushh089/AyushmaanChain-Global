import 'package:ayushmaanchain/service/prescription_nft_service.dart';
import 'package:flutter/widgets.dart';

class PrescriptionNftProvider with ChangeNotifier {
  late PrescriptionNftService _service;
  bool _initialized = false;

  PrescriptionNftService get service => _service;
  bool get initialized => _initialized;

  Future<void> init() async {
    _service = PrescriptionNftService();
    await _service.init();
    _initialized = true;
    notifyListeners();
  }

  String get account => _service.myAddress.hex;
}
