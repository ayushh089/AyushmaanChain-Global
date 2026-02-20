import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart' as http;

class MedicalRecordService {
  late Web3Client _client;
  late DeployedContract _medicalRecordContract;
  late EthPrivateKey _credentials;
  late String walletAddress;

  MedicalRecordService() {
    init();
  }

  Future<void> init() async {
    final rpcUrl = dotenv.env['RPC_URL']!;
    final privateKey = dotenv.env['PRIVATE_KEY']!;
    final contractAddress = EthereumAddress.fromHex(
      dotenv.env['MEDICAL_RECORDS_ADDRESS']!,
    );

    _client = Web3Client(rpcUrl, http.Client());
    _credentials = EthPrivateKey.fromHex(privateKey);
    walletAddress = await _credentials.extractAddress().then(
      (value) => value.hex,
    );
    final abiCode = await rootBundle.loadString(
      "assets/contract/MedicalRecords.json",
    );
    _medicalRecordContract = DeployedContract(
      ContractAbi.fromJson(abiCode, "MedicalRecords"),
      contractAddress,
    );
  }

  Web3Client get client => _client;
  DeployedContract get medicalRecordContract => _medicalRecordContract;
  EthPrivateKey get credentials => _credentials;
  String get account => walletAddress;
}
