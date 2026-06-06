import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { generateSecret, verify } from "otplib"
import QRCode from "qrcode"

import { HTTP_ERROR_MESSAGES } from "../../../core/exceptions/messages.constant"
import { EncryptionService } from "../../../shared/services/encryption/encryption.service"
import { TwoFactorRepository } from "../repositories/two-factor.repository"

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly twoFactorRepository: TwoFactorRepository,
    private readonly encryptionService: EncryptionService
  ) {}

  async generateQrcode(id: string) {
    const secret = generateSecret()
    const secretSecure = this.encryptionService.encrypt(secret)

    await this.twoFactorRepository.saveTwoFactorSecret(id, secretSecure)

    const qrcode = await QRCode.toDataURL(secret)

    return qrcode
  }

  async verifyTOTPCode(id: string, code: string): Promise<boolean> {
    const twoFactorState = await this.twoFactorRepository.getTwoFactorState(id)

    if (!twoFactorState)
      throw new UnauthorizedException(
        HTTP_ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS
      )

    const { isTwoFactorEnabled, twoFactorSecretKey } = twoFactorState

    if (!twoFactorSecretKey)
      throw new BadRequestException(HTTP_ERROR_MESSAGES.AUTH_TFA_IS_NOT_SET_UP)

    const secret = this.encryptionService.decrypt(twoFactorSecretKey)

    const isValid = (await verify({ token: code, secret })).valid

    if (!isValid)
      throw new UnauthorizedException(HTTP_ERROR_MESSAGES.AUTH_INVALID_TFA)

    if (!isTwoFactorEnabled) {
      await this.twoFactorRepository.updateTwoFactorState(id)
    }

    return isValid
  }
}
