namespace API.Interfaces;

public interface IRNGService
{
    string GetRandomNumbers(int min, int max, int count);
}
