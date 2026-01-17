import { Controller, Get } from "@nestjs/common"

@Controller()
export class AppController {

  @Get()
  getHello(): void {
    console.log("Easify Finance Module is running")
  }
}
