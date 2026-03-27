using UnityEngine;

public class WeatherManager : MonoBehaviour
{
    public enum WeatherState { Clear, Rain, Storm, Fog, HeatWave }
    
    [Header("Weather Settings")]
    public WeatherState currentWeather;
    public float transitionDuration = 10f;
    
    [Header("Effects")]
    public ParticleSystem rainEffect;
    public ParticleSystem dustEffect;
    public Light sunLight;
    public Color clearSkyColor;
    public Color stormSkyColor;

    private float transitionTimer;

    private void Update()
    {
        // Simple state machine for demonstration
        if (Input.GetKeyDown(KeyCode.F1)) ChangeWeather(WeatherState.Clear);
        if (Input.GetKeyDown(KeyCode.F2)) ChangeWeather(WeatherState.Rain);
    }

    public void ChangeWeather(WeatherState newState)
    {
        Debug.Log($"Changing weather to {newState}");
        currentWeather = newState;
        
        switch (newState)
        {
            case WeatherState.Clear:
                if (rainEffect) rainEffect.Stop();
                if (dustEffect) dustEffect.Stop();
                // Lerp light intensity/color
                break;
            case WeatherState.Rain:
                if (rainEffect) rainEffect.Play();
                if (dustEffect) dustEffect.Stop();
                break;
            case WeatherState.HeatWave:
                if (rainEffect) rainEffect.Stop();
                if (dustEffect) dustEffect.Play();
                break;
        }
    }
}
