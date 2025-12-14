import { randomUUID } from 'node:crypto'
import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'

import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => {
        const isDev = envService.isDev
        const logLevel = envService.logLevel

        return {
          pinoHttp: {
            level: logLevel,
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: false,
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
            genReqId: (req, res) => {
              const existingID =
                req.headers['x-request-id'] || req.headers['x-correlation-id']
              if (existingID) return existingID

              const id = randomUUID()
              res.setHeader('X-Request-Id', id)
              return id
            },
            autoLogging: {
              ignore: (req) => {
                return (req.url as string).includes('/health')
              },
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.body.password',
                'req.body.confirmPassword',
              ],
              remove: true,
            },
            serializers: {
              req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
              }),
              res: (res) => ({
                statusCode: res.statusCode,
              }),
            },
          },
        }
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
