import { HttpStatusCode } from "axios";
import logger from "../config/logghandler.js";
import KafkaService from "../services/kafkaService.js";
import AppError from "../config/apperror.js";

class ConsumerEvent {
  constructor() {
      this.kafka = new KafkaService();
      this.messageTopic = "user.authentication.events";
      this.responseTopic = "user.authentication.responses";
  }

  async consumeMessage() {
      try {
          await this.kafka.connectProducer();
          await this.kafka.consumeMessages(this.messageTopic, async (message, correlationId) => {
              logger.info(`Message received: ${JSON.stringify(message)} correlationid: ${correlationId}`);
              const response = { status: true, data: "User created successfully" };
              await this.kafka.sendResponse(this.responseTopic, response, correlationId);
          });
      } catch (error) {
          logger.error(`Error in consumeMessage: ${error.message}`);
          throw new AppError(HttpStatusCode.InternalServerError, error.message);
      }
  }
}

export default ConsumerEvent;
