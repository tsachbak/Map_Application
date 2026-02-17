using System.Text;
using System.Text.Json;

namespace server.Utils
{
    /// <summary>
    /// Serializes on object into a GeoJSON file format.
    /// </summary>
    public static class GeoJsonFileSerializer
    {
        public static byte[] SerializeToUtf8Bytes(object value)
        {
            var json = JsonSerializer.Serialize(value, new JsonSerializerOptions
            {
                WriteIndented = true,
            });

            return Encoding.UTF8.GetBytes(json);
        }
    }
}
