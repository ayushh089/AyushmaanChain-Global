import 'blockchain_service.dart';
import 'package:web3dart/web3dart.dart';

class UserRegistryService extends BlockchainService {
  late DeployedContract contract;

  @override
  Future<void> init() async {
    await super.init();
    contract = await loadContract(
      abiPath: 'assets/contract/UserRegistry.json',
      contractName: 'UserRegistry',
      contractAddressEnvKey: 'USER_REGISTRY_ADDRESS',
    );
  }

  Future<String> registerUser(String userType) async {
    if (contract == null) throw Exception("Contract not initialized yet.");
    return await writeFunction(contract, 'registerUser', [userType]);
  }

  Future<bool> isRegistered(String address) async {
    final result = await readFunction(contract, 'isRegistered', [
      EthereumAddress.fromHex(address),
    ]);
    return result.first as bool;
  }
}
