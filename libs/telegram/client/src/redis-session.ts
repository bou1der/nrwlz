import { RedisClient as Redis } from "@lrp/redis";
import { AuthKey } from "telegram/crypto/AuthKey";
import { MemorySession } from "telegram/sessions";

interface RedisSessionData {
  dcId: number;
  port: number;
  serverAddress: string;
  authKey: string;
  takeoutId?: number;
}

export class RedisSession extends MemorySession {
  private _isLoading = false;
  private _lastSavedData: string | null = null;
  private redis: Redis

  constructor(redis: Redis) {
    super();
    this.redis = redis;
    this._dcId = 0;
    this._serverAddress = "";
    this._port = 0;
  }

  private async getRedisSession(): Promise<RedisSessionData | null> {
    try {
      const rawData = await this.redis.get("telegram:session");
      if (!rawData) {
        return null;
      }
      return JSON.parse(rawData as string);
    } catch (err) {
      console.error(err)
      return null;
    }
  }

  override async load(): Promise<void> {
    if (this._isLoading) return;
    this._isLoading = true;
    try {
      const session = await this.getRedisSession();
      if (!session?.dcId || !session.serverAddress || !session.authKey) {
        return;
      }

      const authKey = new AuthKey();
      await authKey.setKey(Buffer.from(session.authKey, "hex"));

      this._dcId = session.dcId;
      this._serverAddress = session.serverAddress;
      this._port = session.port;
      this._authKey = authKey;
      this._takeoutId = session.takeoutId as undefined;

      super.setDC(session.dcId, session.serverAddress, session.port);
      super.setAuthKey(authKey, session.dcId);
    } finally {
      this._isLoading = false;
    }
  }

  override async setDC(
    dcId: number,
    serverAddress: string,
    port: number,
  ): Promise<void> {
    if (
      this._dcId === dcId &&
      this._serverAddress === serverAddress &&
      this._port === port
    ) {
      return;
    }
    this._dcId = dcId;
    this._serverAddress = serverAddress;
    this._port = port;
    super.setDC(dcId, serverAddress, port);
    await this.save();
  }

  override set authKey(value: AuthKey | undefined) {
    this._authKey = value;
    this.save()
      .catch((err) => console.error("Failed to save authKey:", err));
  }

  override get authKey(): AuthKey | undefined {
    return this._authKey;
  }

  override async save() {

    try {
      if (!this._dcId || !this._serverAddress || !this._port) {
        console.warn("Cannot save session: missing required fields");
        return;
      }

      const data: RedisSessionData = {
        dcId: this._dcId,
        serverAddress: this._serverAddress,
        port: this._port,
        authKey: this._authKey?.getKey()?.toString("hex") || "",
        takeoutId: this._takeoutId,
      };

      const dataStr = JSON.stringify(data);
      if (this._lastSavedData === dataStr) {
        return;
      }

      await this.redis.set("telegram:session", dataStr);
      this._lastSavedData = dataStr;
    } catch (err) {
      console.error("Error saving session to Redis:", err);
      throw err;
    }
  }


  override async delete(): Promise<void> {
    try {
      await this.redis.del("telegram:session");
      this._dcId = 0;
      this._serverAddress = "";
      this._port = 0;
      this._authKey = undefined;
      this._takeoutId = undefined;
      this._lastSavedData = null;
    } catch (err) {
      console.error("Error deleting session from Redis:", err);
    }
  }
}
