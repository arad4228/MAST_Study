from fastecdsa.curve import secp256k1
from fastecdsa.point import Point
from fastecdsa.keys import gen_private_key

# Generate private key
private_key = gen_private_key(secp256k1)

# Derive public key
public_key = private_key * secp256k1.G

# Print keys
print("Private key:", hex(private_key))
print("Public key:", public_key)
