import { DEFAULT_NETWORK, getNetworkConfig, Network, NetworkConfig } from '@/app/config';
import { 
    rpc,
    Contract,
    Keypair,
    TransactionBuilder,
    Account,
    BASE_FEE,
    scValToNative
  } from '@stellar/stellar-sdk';
import { ICusdService } from './types';
  

export class CusdService implements ICusdService {
private readonly network: Network;
private readonly config: NetworkConfig;
private readonly rpcServer: rpc.Server;
private readonly networkPassphrase: string;

constructor(network?: Network) {
    this.network = network ?? DEFAULT_NETWORK;
    this.config = getNetworkConfig(this.network);
    this.rpcServer = new rpc.Server(this.config.sorobanUrl);
    this.networkPassphrase = this.config.networkPassphrase;
}

async totalSupply(): Promise<string | undefined> {
    try {
    const contract = new Contract(this.config.cusd.contractId);
    const dummyKeypair = Keypair.random();
    const dummyAccount = new Account(dummyKeypair.publicKey(), "0");
    const transaction = new TransactionBuilder(dummyAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
    })
        .addOperation(contract.call("total_supply"))
        .setTimeout(30)
        .build();

    const simResult = await this.rpcServer.simulateTransaction(transaction);
    
    if (rpc.Api.isSimulationSuccess(simResult)) {
        const scVal = simResult.result?.retval;
        if (scVal) {
        const totalSupply = scValToNative(scVal);
        console.log(totalSupply)
        return BigInt(0).toString()
        } else {
        throw new Error('No return value from total_supply simulation');
        }
    } else {
        throw new Error(`Simulation failed: ${JSON.stringify(simResult)}`);
    }
    } catch (error) {
    throw new Error(`Failed to query total supply: ${error}`);
    }
}
}

export default CusdService;