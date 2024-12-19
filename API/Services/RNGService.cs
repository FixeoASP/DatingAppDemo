using API.Interfaces;

namespace API.Services;

public class RNGService : IRNGService
{
    public string? GetRandomNumbers(int min, int max, int count)
    {
        if (max < min || count < 1) return null;
        var rand = new Random();
        var nrSet = new HashSet<int>();
        for (int i = 0; i < count; i++)
        {
            int nr = 0;
            int seed = 0;
            do
            {
                nr = rand.Next(min, max + 1);
                System.Threading.Thread.Sleep(nr * 10);
                seed = GetSeed(nr);
                rand = new Random(seed);
            } while (nrSet.Contains(nr));
            nrSet.Add(nr);
        }

        var nrList = nrSet.ToList<int>();
        nrList.Sort();

        var nrListStr = "";
        foreach (var nr in nrList)
        {
            nrListStr += nr + " ";
        }
        return nrListStr;
    }

    // TODO Get seed from another service
    private int GetSeed(int factor)
    {
        var now = DateTime.Now;
        var result = 15101993 + 14111965 + 10101963 + 4111992;
        result *= (now.Year + now.Month + now.Day
                + now.Hour + now.Minute + now.Second);
        result /= now.Microsecond;
        result *= factor;
        return result;
    }
}
