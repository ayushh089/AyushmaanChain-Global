import 'dart:typed_data';

import 'package:web3dart/crypto.dart';

import 'blockchain_service.dart';
import 'package:web3dart/web3dart.dart';

class PrescriptionNftService extends BlockchainService {
  late DeployedContract contract;

  @override
  Future<void> init() async {
    await super.init();
    contract = await loadContract(
      abiPath: 'assets/contract/PrescriptionNFT.json',
      contractName: 'PrescriptionNFT',
      contractAddressEnvKey: 'PRESCRIPTIONNFT',
    );
  }

  Future<bool> isVerified(BigInt tokenId) async {
    final result = await readFunction(contract, 'isVerified', [tokenId]);
    return result.first as bool;
  }

  Future<bool> isFulfilled(BigInt tokenId) async {
    final result = await readFunction(contract, 'isFulfilled', [tokenId]);
    return result.first as bool;
  }

  Future<bool> isExpired(BigInt tokenId) async {
    final result = await readFunction(contract, 'isExpired', [tokenId]);
    return result.first as bool;
  }

  Future<bool> isRevoked(BigInt tokenId) async {
    final result = await readFunction(contract, 'isRevoked', [tokenId]);
    return result.first as bool;
  }

  Future<String> fulfillPrescription(BigInt tokenId) async {
    return await writeFunction(contract, 'fulfillPrescription', [tokenId]);
  }

  Future<String> tokenURI(BigInt tokenId) async {
    final result = await readFunction(contract, 'tokenURI', [tokenId]);

    return result.first as String;
  }

  //------------------

  Uint8List padTo32Bytes(Uint8List input) {
    final padded = Uint8List(32);
    final start = 32 - input.length;
    padded.setRange(start, 32, input);
    return padded;
  }

  Future<Map<String, String>> getDoctorAndPatientByTokenId(BigInt tokenId) async {

    final eventSignature = 'PrescriptionMinted(address,address,uint256)';
    final eventHash = bytesToHex(keccakUtf8(eventSignature), include0x: true);

    final tokenBytes = intToBytes(tokenId);
    final paddedToken = padTo32Bytes(tokenBytes);
    final tokenTopic = bytesToHex(paddedToken, include0x: true);

    final logs = await client.getLogs(
      FilterOptions(
        fromBlock: BlockNum.genesis(),
        toBlock: BlockNum.current(),
        address: contract.address,
        topics: [
          [eventHash], 
          [], 
          [], 
          [tokenTopic], 
        ],
      ),
    );

    if (logs.isEmpty) throw Exception("No PrescriptionMinted event found");

    final decoded = contract
        .event('PrescriptionMinted')
        .decodeResults(logs.first.topics!, logs.first.data!);

return {
  'doctor': EthereumAddress.fromHex(decoded[0].toString()).hexEip55,
  'patient': EthereumAddress.fromHex(decoded[1].toString()).hexEip55,
};

  }
}
