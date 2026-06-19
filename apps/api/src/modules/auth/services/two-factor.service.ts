import { Injectable } from "@nestjs/common"
import { generateSecret, generateURI, verify } from "otplib"
import QRCode from "qrcode"

import { EnvService } from "../../../core/env/env.service"
import { AuthTOTPFailedException } from "../../../core/exceptions/domain.exception"
import { EncryptionService } from "../../../shared/services/encryption/encryption.service"
import { TwoFactorRepository } from "../repositories/two-factor.repository"

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly twoFactorRepository: TwoFactorRepository,
    private readonly encryptionService: EncryptionService,
    private readonly envService: EnvService
  ) {}

  async generateQrcode(id: string) {
    const secret = generateSecret()
    const secretSecure = this.encryptionService.encrypt(secret)

    await this.twoFactorRepository.saveTwoFactorSecret(id, secretSecure)

    const uri = generateURI({
      issuer: this.envService.totpIssuer,
      label: this.envService.totpLabel,
      secret,
    })

    const qrcode = await QRCode.toDataURL(uri)

    return qrcode
  }

  async verifyTOTPCode(id: string, code: string): Promise<boolean> {
    const twoFactorState = await this.twoFactorRepository.getTwoFactorState(id)

    if (!twoFactorState) throw new AuthTOTPFailedException()

    const { isTwoFactorEnabled, twoFactorSecretKey } = twoFactorState

    if (!twoFactorSecretKey) throw new AuthTOTPFailedException()

    const secret = this.encryptionService.decrypt(twoFactorSecretKey)

    const isValid = (await verify({ token: code, secret })).valid

    if (!isValid) throw new AuthTOTPFailedException()

    if (!isTwoFactorEnabled) {
      await this.twoFactorRepository.updateTwoFactorState(id)
    }

    return isValid
  }
}
