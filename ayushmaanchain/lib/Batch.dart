
class Batch {
  final BigInt merkleRoot;
  final String metadataURI;
  final String manufacturer;
  final BigInt timestamp;

  Batch({
    required this.merkleRoot,
    required this.metadataURI,
    required this.manufacturer,
    required this.timestamp,
  });

  factory Batch.fromBlockchain(List<dynamic> response) {
    return Batch(
      merkleRoot: BigInt.parse(response[0].toString()),
      metadataURI: response[1] as String,
      manufacturer: response[2].toString(),
      timestamp: response[3] as BigInt,
    );
  }


}
