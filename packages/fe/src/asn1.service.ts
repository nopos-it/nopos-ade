/**
 * ASN.1 Service Implementation
 * Basic ASN.1 encoding/decoding for timestamping
 */

export class Asn1Service {
  /**
   * Encode data to ASN.1 DER format
   * This is a simplified implementation for timestamping
   */
  async encode(data: any): Promise<Buffer> {
    // For timestamping, we typically encode a hash
    if (typeof data === 'string') {
      // Simple DER encoding for hash
      const hashBuffer = Buffer.from(data, 'hex');
      return this.encodeOctetString(hashBuffer);
    }

    if (Buffer.isBuffer(data)) {
      return this.encodeOctetString(data);
    }

    throw new Error('Unsupported data type for ASN.1 encoding');
  }

  /**
   * Decode ASN.1 DER data
   */
  async decode(data: Buffer): Promise<any> {
    try {
      return this.decodeOctetString(data);
    } catch (error) {
      throw new Error(
        `ASN.1 decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Encode OCTET STRING in DER format
   */
  private encodeOctetString(data: Buffer): Buffer {
    const length = data.length;
    let lengthBytes: Buffer;

    if (length < 128) {
      // Short form
      lengthBytes = Buffer.from([length]);
    } else {
      // Long form
      const lengthBuffer = Buffer.alloc(4);
      lengthBuffer.writeUInt32BE(length, 0);

      // Find first non-zero byte
      let start = 0;
      while (start < 4 && lengthBuffer[start] === 0) {
        start++;
      }

      const actualLength = 4 - start;
      lengthBytes = Buffer.concat([Buffer.from([0x80 | actualLength]), lengthBuffer.slice(start)]);
    }

    return Buffer.concat([
      Buffer.from([0x04]), // OCTET STRING tag
      lengthBytes,
      data,
    ]);
  }

  /**
   * Decode OCTET STRING from DER format
   */
  private decodeOctetString(data: Buffer): Buffer {
    if (data.length < 2) {
      throw new Error('Invalid ASN.1 data: too short');
    }

    if (data[0] !== 0x04) {
      throw new Error('Invalid ASN.1 data: expected OCTET STRING tag');
    }

    let length: number;
    let offset = 1;

    if (data[1] < 128) {
      // Short form
      length = data[1];
      offset = 2;
    } else {
      // Long form
      const lengthOfLength = data[1] & 0x7f;
      if (lengthOfLength === 0 || lengthOfLength > 4) {
        throw new Error('Invalid ASN.1 data: invalid length encoding');
      }

      length = 0;
      for (let i = 0; i < lengthOfLength; i++) {
        length = (length << 8) | data[offset + i];
      }
      offset += lengthOfLength;
    }

    if (offset + length > data.length) {
      throw new Error('Invalid ASN.1 data: length exceeds buffer');
    }

    return data.slice(offset, offset + length);
  }

  /**
   * Create timestamp request
   */
  async createTimestampRequest(hash: string, hashAlgorithm: string = 'sha256'): Promise<Buffer> {
    // This is a simplified timestamp request
    // In a real implementation, this would create a proper PKCS#10 request
    const requestData = {
      hash,
      hashAlgorithm,
      timestamp: Date.now(),
    };

    return this.encode(JSON.stringify(requestData));
  }

  /**
   * Parse timestamp response
   */
  async parseTimestampResponse(response: Buffer): Promise<{
    timestamp: string;
    accuracy?: number;
    tsa?: string;
  }> {
    try {
      const decoded = await this.decode(response);
      const data = JSON.parse(decoded.toString());

      return {
        timestamp: new Date(data.timestamp).toISOString(),
        accuracy: data.accuracy,
        tsa: data.tsa,
      };
    } catch (error) {
      throw new Error(
        `Timestamp response parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
