using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance;

    [Header("HUD Elements")]
    public Text speedText;
    public Slider staminaSlider;
    public Text missionTimerText;
    public GameObject missionPanel;
    public Text missionTitle;
    public Text missionObjective;

    [Header("Menus")]
    public GameObject pauseMenu;
    public GameObject gameOverMenu;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void UpdateHUD(float speed, float stamina, float timeRemaining)
    {
        if (speedText) speedText.text = $"Speed: {speed:F1} km/h";
        if (staminaSlider) staminaSlider.value = stamina;
        if (missionTimerText) missionTimerText.text = FormatTime(timeRemaining);
    }

    public void ShowMissionStart(string title, string objective)
    {
        if (missionPanel)
        {
            missionPanel.SetActive(true);
            if (missionTitle) missionTitle.text = title;
            if (missionObjective) missionObjective.text = objective;
            Invoke("HideMissionPanel", 5f);
        }
    }

    private void HideMissionPanel()
    {
        if (missionPanel) missionPanel.SetActive(false);
    }

    public void TogglePauseMenu(bool isPaused)
    {
        if (pauseMenu) pauseMenu.SetActive(isPaused);
        Time.timeScale = isPaused ? 0 : 1;
    }

    private string FormatTime(float timeInSeconds)
    {
        int minutes = Mathf.FloorToInt(timeInSeconds / 60);
        int seconds = Mathf.FloorToInt(timeInSeconds % 60);
        return $"{minutes:00}:{seconds:00}";
    }
}
