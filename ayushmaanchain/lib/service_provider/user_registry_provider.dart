import 'package:flutter/widgets.dart';
import '../service/user_registry_service.dart';

class UserRegistryProvider with ChangeNotifier {
  late UserRegistryService _service;
  bool _initialized = false;

  UserRegistryService get service => _service;
  bool get initialized => _initialized;

  Future<void> init() async {
    _service = UserRegistryService();
    await _service.init();
    _initialized = true;
    notifyListeners();
  }

  String get account => _service.myAddress.hex;
}
