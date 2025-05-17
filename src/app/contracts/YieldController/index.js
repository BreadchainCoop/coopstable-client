import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const Errors = {
    1: { message: "InsufficientBalance" },
    2: { message: "LendingOperationFailed" },
    3: { message: "Unauthorized" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { yield_distributor, adapter_registry, cusd_manager, admin, owner }, 
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ yield_distributor, adapter_registry, cusd_manager, admin, owner }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAUAAAAAAAAAEXlpZWxkX2Rpc3RyaWJ1dG9yAAAAAAAAEwAAAAAAAAAQYWRhcHRlcl9yZWdpc3RyeQAAABMAAAAAAAAADGN1c2RfbWFuYWdlcgAAABMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAASZGVwb3NpdF9jb2xsYXRlcmFsAAAAAAAEAAAAAAAAAAhwcm90b2NvbAAAABEAAAAAAAAABHVzZXIAAAATAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAAL",
            "AAAAAAAAAAAAAAATd2l0aGRyYXdfY29sbGF0ZXJhbAAAAAAEAAAAAAAAAAhwcm90b2NvbAAAABEAAAAAAAAABHVzZXIAAAATAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAAL",
            "AAAAAAAAAAAAAAAJZ2V0X3lpZWxkAAAAAAAAAAAAAAEAAAAL",
            "AAAAAAAAAAAAAAALY2xhaW1feWllbGQAAAAAAAAAAAEAAAAL",
            "AAAAAAAAAAAAAAAVc2V0X3lpZWxkX2Rpc3RyaWJ1dG9yAAAAAAAAAQAAAAAAAAAReWllbGRfZGlzdHJpYnV0b3IAAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAUc2V0X2FkYXB0ZXJfcmVnaXN0cnkAAAABAAAAAAAAABBhZGFwdGVyX3JlZ2lzdHJ5AAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAQc2V0X2N1c2RfbWFuYWdlcgAAAAEAAAAAAAAADGN1c2RfbWFuYWdlcgAAABMAAAAA",
            "AAAAAAAAAAAAAAAVZ2V0X3lpZWxkX2Rpc3RyaWJ1dG9yAAAAAAAAAAAAAAEAAAAT",
            "AAAAAAAAAAAAAAAUZ2V0X2FkYXB0ZXJfcmVnaXN0cnkAAAAAAAAAAQAAABM=",
            "AAAAAAAAAAAAAAAQZ2V0X2N1c2RfbWFuYWdlcgAAAAAAAAABAAAAEw==",
            "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAluZXdfYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAQAAAAAAAAAAAAAACFJvbGVEYXRhAAAAAgAAAAAAAAAKYWRtaW5fcm9sZQAAAAAAEQAAAAAAAAAHbWVtYmVycwAAAAPsAAAAEwAAAAE=",
            "AAAAAQAAADFBIHN0b3JhZ2Ugc3RydWN0dXJlIGZvciBhbGwgcm9sZXMgaW4gdGhlIGNvbnRyYWN0AAAAAAAAAAAAAAhSb2xlc01hcAAAAAEAAAAAAAAABXJvbGVzAAAAAAAD7AAAABEAAAfQAAAACFJvbGVEYXRh",
            "AAAAAgAAAAAAAAAAAAAAEFN1cHBvcnRlZEFkYXB0ZXIAAAACAAAAAAAAAAAAAAAMQmxlbmRDYXBpdGFsAAAAAQAAAAAAAAAGQ3VzdG9tAAAAAAABAAAAEQ==",
            "AAAAAgAAAAAAAAAAAAAAElN1cHBvcnRlZFlpZWxkVHlwZQAAAAAAAwAAAAAAAAAAAAAAB0xlbmRpbmcAAAAAAAAAAAAAAAAJTGlxdWlkaXR5AAAAAAAAAQAAAAAAAAAGQ3VzdG9tAAAAAAABAAAAEQ==",
            "AAAABAAAAAAAAAAAAAAADEFkYXB0ZXJFcnJvcgAAAAMAAAAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAAQAAAAAAAAAWTGVuZGluZ09wZXJhdGlvbkZhaWxlZAAAAAAAAgAAAAAAAAAMVW5hdXRob3JpemVkAAAAAw=="]), options);
        this.options = options;
    }
    fromJSON = {
        deposit_collateral: (this.txFromJSON),
        withdraw_collateral: (this.txFromJSON),
        get_yield: (this.txFromJSON),
        claim_yield: (this.txFromJSON),
        set_yield_distributor: (this.txFromJSON),
        set_adapter_registry: (this.txFromJSON),
        set_cusd_manager: (this.txFromJSON),
        get_yield_distributor: (this.txFromJSON),
        get_adapter_registry: (this.txFromJSON),
        get_cusd_manager: (this.txFromJSON),
        set_admin: (this.txFromJSON)
    };
}
