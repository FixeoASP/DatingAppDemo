namespace API.Interfaces;

public interface IRNGService
{
    Task<string> GetRandomNumbers(int min, int max, int count);
}
