using UnityEngine;

public class TerrainGenerator : MonoBehaviour
{
    [Header("Generation Settings")]
    public int width = 256;
    public int height = 256;
    public float scale = 20f;
    public float heightMultiplier = 10f;

    [Header("References")]
    public Terrain terrain;

    private void Start()
    {
        if (terrain == null) terrain = GetComponent<Terrain>();
        if (terrain != null)
        {
            GenerateTerrain();
        }
    }

    public void GenerateTerrain()
    {
        if (terrain.terrainData == null) return;

        terrain.terrainData = GenerateTerrainData(terrain.terrainData);
    }

    private TerrainData GenerateTerrainData(TerrainData terrainData)
    {
        terrainData.heightmapResolution = width + 1;
        terrainData.size = new Vector3(width, heightMultiplier, height);
        
        terrainData.SetHeights(0, 0, GenerateHeights());
        return terrainData;
    }

    private float[,] GenerateHeights()
    {
        float[,] heights = new float[width, height];
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                heights[x, y] = CalculateHeight(x, y);
            }
        }
        return heights;
    }

    private float CalculateHeight(int x, int y)
    {
        float xCoord = (float)x / width * scale;
        float yCoord = (float)y / height * scale;

        return Mathf.PerlinNoise(xCoord, yCoord);
    }
}
