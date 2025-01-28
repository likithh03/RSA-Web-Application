let privateKey, publicKey;

// Generate RSA keys
async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );

    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;

    document.getElementById('bit-size').innerText = '2048 bits';

    const exportedPublicKey = await exportKey(publicKey);
    const exportedPrivateKey = await exportKey(privateKey);

    document.getElementById('public-key').innerText = exportedPublicKey;
    document.getElementById('private-key').innerText = exportedPrivateKey;
}

// Export key as PEM string
async function exportKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        key.type === "public" ? "spki" : "pkcs8",
        key
    );
    const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
    const base64 = btoa(exportedAsString);
    const keyType = key.type === "public" ? "PUBLIC KEY" : "PRIVATE KEY";
    return `-----BEGIN ${keyType}-----\n${base64}\n-----END ${keyType}-----`;
}

// Encrypt message
async function encryptMessage() {
    const message = document.getElementById('message').value;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        data
    );

    const ciphertext = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    document.getElementById('encrypted').innerText = `Encrypted Message:\n${ciphertext}`;
}

// Decrypt message
async function decryptMessage() {
    const ciphertext = document.getElementById('ciphertext').value;
    const binary = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        binary
    );

    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decrypted);
    document.getElementById('decrypted').innerText = `Decrypted Message:\n${plaintext}`;
}
