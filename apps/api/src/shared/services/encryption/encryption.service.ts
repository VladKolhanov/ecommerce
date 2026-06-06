import { Injectable } from "@nestjs/common"
import * as crypto from "crypto"

import { EnvService } from "../../../core/env/env.service"

@Injectable()
export class EncryptionService {
  constructor(private readonly envService: EnvService) {}

  private readonly algorithm = "aes-256-ctr"
  private readonly secretKey = this.envService.encryptionSecret

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`
  }

  decrypt(content: string): string {
    const [ivHex, encryptedHex] = content.split(":")
    const iv = Buffer.from(ivHex, "hex")
    const encryptedText = Buffer.from(encryptedHex, "hex")

    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv)
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ])

    return decrypted.toString()
  }
}
