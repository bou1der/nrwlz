import { parse } from "@tma.js/init-data-node"
import { UserRoleEnum } from "@lrp/shared/types/user";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { uuidv7 } from "uuidv7";
import { isValid } from "@tma.js/init-data-node";
import { IUser, IAccount } from "../../entities";
import { Session } from "../../auth.service";
import { getNameFromTelegram, provider_id } from "./telegram";

@Injectable()
export class TelegramSessionProvider {
  constructor(
    @Inject() private readonly env: ConfigService,
    @InjectRepository(IUser) private readonly userRepo: Repository<IUser>,
    @InjectDataSource() private readonly db: DataSource,
  ) { }


  async getSessionByInitData(initData: string): Promise<Session | null> {
    if (!isValid(initData, this.env.getOrThrow("TELEGRAM_BOT_TOKEN"))) return null
    const parsed = parse(initData)
    if (!parsed.user) return null

    let user = await this.userRepo.findOne({
      where: {
        telegramId: parsed.user.id.toString(),
      },
      cache: true
    })

    if (!user) {
      const name = getNameFromTelegram(parsed.user)
      user = await this.userRepo.create({
        id: uuidv7(),
        telegramId: parsed.user.id.toString(),
        email: `${name}@example.com`,
        emailVerified: false,
        name,
        image: parsed.user.photo_url,
        role: UserRoleEnum.user,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
        .save()
      await this.db.createQueryBuilder()
        .insert()
        .into(IAccount)
        .values({
          id: uuidv7(),
          userId: user.id,
          accountId: parsed.user.id.toString(),
          providerId: provider_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute()
      if (parsed.start_param) await this.checkReferral(user, parsed.start_param)
    }

    return {
      user,
      session: null
    }
  }

  async checkReferral(user: IUser, startParam: string) {
    const inviter = await this.userRepo.findOne({
      where: {
        telegramId: startParam,
      }
    })
    if (inviter && inviter.id !== user.id) {
      await this.db.createQueryBuilder()
        .update(IUser)
        .set({
          invitedBy: inviter.id,
        })
        .where("id = :id", {
          id: user.id
        })
        .execute()
    }
  }
}
