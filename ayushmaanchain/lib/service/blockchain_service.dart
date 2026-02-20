import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';

class BlockchainService {
  late Web3Client client;
  late EthPrivateKey credentials;
  late EthereumAddress myAddress;

  Future<void> init() async {
    final rpcUrl = dotenv.env['RPC_URL']!;
    final privateKey = dotenv.env['PRIVATE_KEY']!;

    client = Web3Client(rpcUrl, Client());
    credentials = EthPrivateKey.fromHex(privateKey);
    myAddress = await credentials.extractAddress();
  }

  Future<DeployedContract> loadContract({
    required String abiPath,
    required String contractName,
    required String contractAddressEnvKey,
  }) async {
    final abiString = await rootBundle.loadString(abiPath);
    final abiJson = jsonDecode(abiString);
    final contractAbi = ContractAbi.fromJson(
      jsonEncode(abiJson['abi']),
      contractName,
    );
    final contractAddress = EthereumAddress.fromHex(
      dotenv.env[contractAddressEnvKey]!,
    );

    return DeployedContract(contractAbi, contractAddress);
  }

  Future<String> writeFunction(
    DeployedContract contract,
    String functionName,
    List<dynamic> params,
  ) async {
    final function = contract.function(functionName);
    return await client.sendTransaction(
      credentials,
      Transaction.callContract(
        contract: contract,
        function: function,
        parameters: params,
      ),
      chainId: 1337,
    );
  }

  Future<List<dynamic>> readFunction(
    DeployedContract contract,
    String functionName,
    List<dynamic> params,
  ) async {
    final function = contract.function(functionName);
    return await client.call(
      contract: contract,
      function: function,
      params: params,
    );
  }
}
