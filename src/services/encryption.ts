import { EncryptionKeys } from '../types';

export class EncryptionService {
  private static instance: EncryptionService;
  private keyPair: EncryptionKeys | null = null;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async generateKeyPair(): Promise<EncryptionKeys> {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-256',
        },
        true,
        ['deriveKey']
      );

      this.keyPair = {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
      };

      return this.keyPair;
    } catch (error) {
      console.error('Key generation error:', error);
      throw new Error('Failed to generate encryption keys');
    }
  }

  async exportPublicKey(): Promise<string> {
    if (!this.keyPair) {
      throw new Error('No key pair available');
    }

    try {
      const exported = await window.crypto.subtle.exportKey(
        'raw',
        this.keyPair.publicKey
      );
      return btoa(String.fromCharCode(...new Uint8Array(exported)));
    } catch (error) {
      console.error('Public key export error:', error);
      throw new Error('Failed to export public key');
    }
  }

  async encryptMessage(message: string, recipientPublicKey: string): Promise<string> {
    if (!this.keyPair) {
      throw new Error('No key pair available');
    }

    try {
      // Import recipient's public key
      const recipientKey = await this.importPublicKey(recipientPublicKey);
      
      // Derive shared secret
      const sharedSecret = await window.crypto.subtle.deriveKey(
        {
          name: 'ECDH',
          public: recipientKey,
        },
        this.keyPair.privateKey,
        {
          name: 'AES-GCM',
          length: 256,
        },
        false,
        ['encrypt']
      );

      // Generate IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt message
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        sharedSecret,
        new TextEncoder().encode(message)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  async decryptMessage(encryptedMessage: string, senderPublicKey: string): Promise<string> {
    if (!this.keyPair) {
      throw new Error('No key pair available');
    }

    try {
      // Import sender's public key
      const senderKey = await this.importPublicKey(senderPublicKey);
      
      // Derive shared secret
      const sharedSecret = await window.crypto.subtle.deriveKey(
        {
          name: 'ECDH',
          public: senderKey,
        },
        this.keyPair.privateKey,
        {
          name: 'AES-GCM',
          length: 256,
        },
        false,
        ['decrypt']
      );

      // Decode encrypted data
      const combined = new Uint8Array(
        atob(encryptedMessage).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      // Decrypt message
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        sharedSecret,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt message');
    }
  }

  private async importPublicKey(publicKeyString: string): Promise<CryptoKey> {
    const keyData = new Uint8Array(
      atob(publicKeyString).split('').map(char => char.charCodeAt(0))
    );

    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      false,
      []
    );
  }
}