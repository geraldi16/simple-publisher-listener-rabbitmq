export interface MessageHandler {
  handleMessage(message: string): Promise<void>;
  handleError(error, message): boolean | Promise<boolean>;
}
