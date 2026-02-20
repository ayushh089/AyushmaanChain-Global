import 'dart:typed_data';

import 'package:ayushmaanchain/Batch.dart';
import 'package:web3dart/crypto.dart';

import 'blockchain_service.dart';
import 'package:web3dart/web3dart.dart';

class DrugNftService extends BlockchainService {
  late DeployedContract contract;

  @override
  Future<void> init() async {
    await super.init();
    contract = await loadContract(
      abiPath: 'assets/contract/DrugNFT.json',
      contractName: 'DrugNFT',
      contractAddressEnvKey: 'DRUGNFT',
    );
  }

  Future<bool> verifyStrip(
    BigInt tokenId,
    String stripId,
    List<Uint8List> merkleProof,
  ) async {
    final result = await readFunction(contract, 'verifyStrip', [
      tokenId,
      stripId,
      merkleProof,
    ]);
    return result.first as bool;
  }

  Future<List> getBatch(BigInt tokenId) async {
    try {
      final result = await readFunction(contract, 'getBatch', [tokenId]);
      return result;
    } catch (e) {
      print("Error in getBatch: $e");
      rethrow;
    }
  }
}
