import 'package:ayushmaanchain/service/drug_dft_service.dart';
import 'package:flutter/widgets.dart';

class DrugNftProvider with ChangeNotifier {
  late DrugNftService _service;
  bool _initialized = false;

  DrugNftService get service => _service;
  bool get initialized => _initialized;

  Future<void> init() async {
    _service = DrugNftService();
    await _service.init();
    _initialized = true;
    notifyListeners();
  }

  String get account => _service.myAddress.hex;
}
