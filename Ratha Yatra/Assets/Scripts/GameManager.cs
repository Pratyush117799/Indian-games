using UnityEngine;
using UnityEngine.SceneManagement;

public enum GameState
{
    MainMenu,
    Playing,
    Paused,
    GameOver
}

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    [Header("Game State")]
    public GameState CurrentState;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);

        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        // Initialize based on active scene
        if (SceneManager.GetActiveScene().name == "MainMenu")
        {
            ChangeState(GameState.MainMenu);
        }
        else
        {
            ChangeState(GameState.Playing);
        }
    }

    public void ChangeState(GameState newState)
    {
        CurrentState = newState;
        Debug.Log($"Game State Changed to: {newState}");

        switch (newState)
        {
            case GameState.MainMenu:
                Time.timeScale = 1;
                // Show Main Menu UI
                break;
            case GameState.Playing:
                Time.timeScale = 1;
                UIManager.Instance?.TogglePauseMenu(false);
                break;
            case GameState.Paused:
                Time.timeScale = 0;
                UIManager.Instance?.TogglePauseMenu(true);
                break;
            case GameState.GameOver:
                Time.timeScale = 1; // Or 0 depending on preference
                // Show Game Over UI
                break;
        }
    }

    public void TogglePause()
    {
        if (CurrentState == GameState.Playing)
        {
            ChangeState(GameState.Paused);
        }
        else if (CurrentState == GameState.Paused)
        {
            ChangeState(GameState.Playing);
        }
    }

    public void RestartLevel()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        ChangeState(GameState.Playing);
    }

    public void ReturnToMainMenu()
    {
        SceneManager.LoadScene("MainMenu");
        ChangeState(GameState.MainMenu);
    }
}
