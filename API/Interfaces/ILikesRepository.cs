using API.Entities;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<UserLike> GetUserLikeAsync(int sourceUserId, int targetUserId);
    Task<AppUser> GetUserWithLikesAsync(int userId);
    Task<IEnumerable<UserLike>> GetUserLikesAsync(string predicate, int userId);
}
