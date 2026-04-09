import type { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { cleanupOpenApiDoc } from "nestjs-zod"

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("E-commerce Platform API")
    .setDescription("The unified API interface for the E-commerce Platform.")
    .addBearerAuth()
    .setVersion("1.0")
    .addTag("")
    .build()

  const documentFactory = SwaggerModule.createDocument(app, config)
  const document = cleanupOpenApiDoc(documentFactory)

  SwaggerModule.setup("/docs", app, document, {
    jsonDocumentUrl: "/swagger.json",
    yamlDocumentUrl: "/swagger.yaml",
    swaggerOptions: {
      docExpansion: "none",
    },
  })
}
