
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'

// Sample secret / public key pair.
// const seckey  = '730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6'
// const pubkey  = '0307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba3'

// gen
const seckey  = 'f7f60a8e91ec29fa5c8b50583b42d1d13ab6dc388e3670e6388c50cc54773cce'
const pubkey  = '7aecdb418169ac218d5e7c0ca9bf0fe4eaa76ac5ae9633e0d87296890c206873'

// For key-spends, we need to tweak both the secret key and public key.
const [ tseckey ] = Tap.getSecKey(seckey)
const [ tpubkey ] = Tap.getPubKey(pubkey)

// Our taproot address is the encoded version of our public tapkey.
const address = Address.p2tr.encode(tpubkey, 'testnet')

// NOTE: For the next step, you need to send 100_000 sats to the above address.
// Make note of the txid of this transaction, plus the index of the output that
// you are spending.

const txdata = Tx.create({
  vin  : [{
    // The txid of your funding transaction.
    txid: 'fbde7872cc1aca4bc93ac9a923f14c3355b4216cac3f43b91663ede7a929471b',
    // The index of the output you are spending.
    vout: 0,
    // For Taproot, we need to specify this data when signing.
    prevout: {
      // The value of the output we are spending.
      value: 100000,
      // This is the script that our taproot address decodes into.
      scriptPubKey: [ 'OP_1', tpubkey ]
    },
  }],
  vout : [{
    // We are locking up 99_000 sats (minus 1000 sats for fees.)
    value: 99000,
    // We are locking up funds to this address.
    scriptPubKey: Address.toScriptPubKey('bcrt1q6zpf4gefu4ckuud3pjch563nm7x27u4ruahz3y')
  }]
})
console.log("Init TxData: %s", JSON.stringify(txdata))

// For this example, we are signing for input 0.

// Provide your tweaked secret key with the transaction, 
// plus the index # of the input you are signing for.
const sig = Signer.taproot.sign(tseckey, txdata, 0)

// Add your signature to the witness data for that input.
txdata.vin[0].witness = [ sig ]
console.log("Inserted TxData: %s", JSON.stringify(txdata))

// For verification, provided your 
await Signer.taproot.verify(txdata, 0, { throws: true })

console.log('Your address:', address)
console.log('Your txhex:', Tx.encode(txdata).hex)