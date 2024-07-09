export type Email = {
  id?: string;
  subject: string;
  message: string;
  from: string;
  recipient: string;
  status: Status;
  attachments?: any;
  sentAt?: string;
  replyTo?: string;
  priority?: Priority;
  meta?: Record<string, any>;
  isTemplated?: boolean;
  uid?: string;
};

export enum Status {
  NEW = "new",
  DRAFT = "draft",
  SENT = "sent",
  FAILED = "failed",
}

export type Priority = "low" | "normal" | "high";

export type Config = {
  recipient?: string;
  scanLimit?: number;
};
