using System.Text.Json;
using API.Helpers;

namespace API.Extensions;

public static class HttpExtensions
{
    private const string PaginationHeaderKey = "Pagination";

    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
    {
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        response.Headers.Append(PaginationHeaderKey, JsonSerializer.Serialize(header, jsonOptions));
        response.Headers.Append(
            Microsoft.Net.Http.Headers.HeaderNames.AccessControlExposeHeaders,
            PaginationHeaderKey);
    }
}
