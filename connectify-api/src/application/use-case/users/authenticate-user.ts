import { UsersRepository } from "@/application/protocols/database"
import { CredentialsInvalidateError, UserNotExistError } from "@/application/errors"

import { IAuthenticateUserUseCase } from "@/domain/use-cases/users"
import { HashRepository } from "@/application/protocols/crypto"


export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashRepository: HashRepository
  ) { }

  async execute(input: IAuthenticateUserUseCase.Input): IAuthenticateUserUseCase.Output {
    const user = await this.usersRepository.findByEmail({ email: input.email })

    if (!user) {
      throw new UserNotExistError()
    }

    const comparePasswordHash = await this.hashRepository.compare({ string: input.password, hash: user.password })

    if (!comparePasswordHash) {
      throw new CredentialsInvalidateError()
    }

    return user
  }
}
