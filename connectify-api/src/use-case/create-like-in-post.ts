import { LikesRepository } from "../repositories/like";
import { PostsRepository } from "../repositories/post";

type CreateLikesInPostUseCaseRequest = {
  postId: number;
  userId: string;
};

export class CreateLikesInPostUseCase {
  constructor(
    private likesRepository: LikesRepository,
    private postsRepository: PostsRepository
  ) {}

  async execute({ postId, userId }: CreateLikesInPostUseCaseRequest) {
    const postById = await this.postsRepository.findById(postId);

    if (!postById) {
      throw new Error("Post not exists with this id.");
    }

    const checkIfTheUserHasAlreadyLikedThePost =
      await this.likesRepository.findByUserIdAndPostId({ postId, userId });

    if (checkIfTheUserHasAlreadyLikedThePost) {
      throw new Error("The user has already liked the post.");
    }

    const like = await this.likesRepository.create({
      postId,
      userId,
    });

    return {
      like,
    };
  }
}
