
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'
import { SecretKey } from '@cmdcode/crypto-utils'

const secret = '0a7d01d1c2e1592a02ea7671bb79ecd31d8d5e660b008f4b10e67787f4f24712'
const seckey = new SecretKey(secret, { type: 'taproot' })
const pubkey = seckey.pub
console.log("Sceret: %s", seckey)
console.log("Pubkey: %s", pubkey)

// Specify a basic script to use for testing.
const script = [ pubkey, 'OP_CHECKSIG' ]
const sbytes = Script.encode(script)
console.log("Script: %s", JSON.stringify(script))
console.log("Sbytes: %s", sbytes)

// For tapscript spends, we need to convert this script into a 'tapleaf'.
const tapleaf = Tap.tree.getLeaf(sbytes)
console.log("TapLeaf: %s", tapleaf)

// Optional: There is a convenience method that converts scripts directly.
const _tapleaf = Tap.encodeScript(script)
console.log("Encoded TapLeaf: %s", _tapleaf)


// Generate a tapkey that includes our leaf script. Also, create a merlke proof 
// (cblock) that targets our leaf and proves its inclusion in the tapkey.
const [ tpubkey, cblock ] = Tap.getPubKey(pubkey, { target: tapleaf })

// A taproot address is simply the tweaked public key, encoded in bech32 format.
const address = Address.p2tr.fromPubKey(tpubkey, 'testnet')
console.log("Address: %s", address)

/* NOTE: To continue with this example, send 100_000 sats to the above address.
  You will also need to make a note of the txid and vout of that transaction,
  so that you can include that information below in the redeem tx.
*/ 

const txdata = Tx.create({
  vin  : [{
    // Use the txid of the funding transaction used to send the sats.
    txid: '181508e3be1107372f1ffcbd52de87b2c3e7c8b2495f1bc25f8cf42c0ae167c2',
    // Specify the index value of the output that you are going to spend from.
    vout: 0,
    // Also include the value and script of that ouput.
    prevout: {
      // Feel free to change this if you sent a different amount.
      value: 100_000,
      // This is what our address looks like in script form.
      scriptPubKey: [ 'OP_1', tpubkey ]
    },
  }],
  vout : [{
    // We are leaving behind 1000 sats as a fee to the miners.
    value: 99_000,
    // This is the new script that we are locking our funds to.
    scriptPubKey: Address.toScriptPubKey('bcrt1q6zpf4gefu4ckuud3pjch563nm7x27u4ruahz3y')
  }]
})
console.log("Init TxData: %s", JSON.stringify(txdata))

// For this example, we are signing for input 0 of our transaction,
// using the untweaked secret key. We are also extending the signature 
// to include a commitment to the tapleaf script that we wish to use.
const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: tapleaf })
console.log("Signature: %s", sig)

// Add the signature to our witness data for input 0, along with the script
// and merkle proof (cblock) for the script.
txdata.vin[0].witness = [ sig.hex, script, cblock ]
console.log("Inserted TxData: %s", JSON.stringify(txdata))

// Check if the signature is valid for the provided public key, and that the
// transaction is also valid (the merkle proof will be validated as well).
const isValid = await Signer.taproot.verify(txdata, 0, { pubkey })
console.log("IsValid: %s", isValid)